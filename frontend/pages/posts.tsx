import NavBar from '../components/navbar'
import { useSession } from 'next-auth/react'
import { useState, useEffect, Fragment, useRef } from 'react'
import { useRouter } from 'next/router';
import Router from 'next/router';
import { Container, Stack, Box } from '@mui/system';
import { Grid, Modal, Button, Typography } from '@mui/material';
import theme from '../styles/muiTheme'
import { Dialog, Transition } from '@headlessui/react'

import dynamic from 'next/dynamic'
import haversine from 'haversine-distance'; /* [lat, long] -> dist */

import Link from 'next/link';
import { EnvelopeIcon } from '@heroicons/react/24/outline';


const postModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: '#E2E8F0',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const mapModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    height: "60%",
    bgcolor: '#E2E8F0',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

type dataProps = {
    _id: string,
    driverId: number,
    departingLocation: string[],
    departingTime: string,
    arrivingLocation: string[],
    numAvailableSeats: number
    passengers: number[]
}

type postProps = {
    _id: string,
    studentId: number,

    displayName: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    rideRequests: [{
        postId: string,
        userId: string,
        accepted: boolean
      }]
}

type buttonProps = {
    userId: number,
    postInfo: dataProps,
    thisId: postProps,
    numAvailableSeats: number,
    passengersLength: number
}

type postCreate = {
    departingTime: string,
    departingLocation: string[],
    arrivingLocation: string[],
    driverId: number,
    numAvailableSeats: string
}

function toFixed(num: number = 0, fixed: number) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re);
}

function PostCheck(value: {[k: string]: FormDataEntryValue}) {
    var validForm = true
    
    const depTime = new Date(value["departing-time"].toString())
    var today = new Date();

    const latRe=/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/
    const longRe=/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/
    if(!(latRe.test(value["dep-latitude"].toString()))){
        console.log(value["dep-latitude"].toString())
        alert("Invalid departure latitude")
        validForm = false
    }
    if(!(longRe.test(value["dep-longitude"].toString()))){
        console.log(value["dep-longitude"].toString())
        alert("Invalid departure longitude")
        validForm = false
    }
    if(!(latRe.test(value["arr-latitude"].toString()))){
        console.log(value["arr-latitude"].toString())
        alert("Invalid arrival latitude")
        validForm = false
    }
    if(!(longRe.test(value["arr-longitude"].toString()))){
        console.log(value["arr-longitude"].toString())
        alert("Invalid arrival longitude")
        validForm = false
    }
    if(depTime < today) {
        alert("Invalid departure time")
        validForm = false
    }
    return validForm
}

const PostMap = dynamic(() => import("../components/PostMap"), { ssr: false });

function PostForm({DLat, DLong, ALat, ALong, DTime, ASeats}:{DLat:string, DLong:string, ALat:string, ALong:string, DTime:string, ASeats:number}) {

    return (
        <div>
            <label text-align="center">Ride Details</label><br /><br />
            <form id="new-post">
            
                <PostMap DLat={DLat} DLong={DLong} ALat={ALat} ALong={ALong}/>

                <input type="hidden" id='dep-latitude' name='dep-latitude' defaultValue={DLat}/>
                <input type="hidden" id='dep-longitude' name='dep-longitude' defaultValue={DLong}/>
                <input type="hidden" id='arr-latitude' name='arr-latitude' defaultValue={ALat}/>
                <input type="hidden" id='arr-longitude' name='arr-longitude' defaultValue={ALong}/>

                <label text-align="left" htmlFor='departing-time'>Departing Time: </label>
                <input type="datetime-local" id='departing-time' name='departing-time' defaultValue={DTime}/><br />

                <label htmlFor="num-of-seats">Available Seats: </label>
                <input type="number" id='num-of-seats' name='num-of-seats' min='1' max='5' defaultValue={ASeats}/><br />
            </form>
        </div>

        
    )
}

function Post({userId}: {userId:number}) {
    const [post, setPost] = useState<postProps>()
    useEffect(() => {
        fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-student-id/${userId}`).then((res) => res.json()).then((post: postProps) => {
            setPost(post)
        })
    }, [userId])
    if (post !== undefined) {
    return(<Box sx={{color: "#E2E8F0", fontWeight: 'bold'}}>{post.displayName} {"("}
    <Link style={{color:"#E2E8F0"}} href={`/auth/profile/${post.email}`}>{post.email}</Link>
    {")"}</Box>)
    } else {
        return <Box>No Posts at this time</Box>
    }
}

function isUserRiding({studentId, postId, userId}: {studentId:number, postId:string, userId: postProps}) {
    var isRiding:boolean = false
    fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-student-id/${studentId}`).then((res) => res.json()).then((post: postProps) => {
        post.rideRequests?.filter(d => d.postId === postId).forEach(element => {
            if (element.userId === userId._id) {
                isRiding = true
            }
        });
    })
    return isRiding
}

const StaticPostMap = dynamic(() => import("../components/StaticPostMap"), { ssr: false })

function ToggleMap({postInfo}:{postInfo:dataProps}) {
    
    const [mapOpen, setMapOpen] = useState(false)
    const handleMapOpen = () => setMapOpen(true)
    const handleMapClose = () => setMapOpen(false)
    
    return (
        <>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded" onClick={() => {
                handleMapOpen()
            }}>View Map</button>
            <Modal
                open={mapOpen}
                onClose={handleMapClose}
            >
                <Box sx={mapModal}>
                    <StaticPostMap postInfo={postInfo}/>
                </Box>
            </Modal>
        </>
    )
}

function Buttons({userId, postInfo, thisId, numAvailableSeats, passengersLength}:buttonProps) {
    console.log(thisId);
    const [openEdit, setOpenEdit] = useState(false)
    const handleOpenEdit = () => setOpenEdit(true)
    const handleCloseEdit = () => setOpenEdit(false)
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null)

    const [post, setPost] = useState<postProps>()
    const router = useRouter();
    function handleSubmit() {
        handleCloseEdit()
        const form = document.getElementById(`new-post`)! as HTMLFormElement
        const formData = new FormData(form);
        const value = Object.fromEntries(formData.entries())
        //:postCreate
        if (PostCheck(value)) {
            const send = {
                postId: postInfo._id as string,
                update: {
                    departingTime: value["departing-time"] as string,
                    departingLocation: [value["dep-latitude"], value["dep-longitude"]] as string[],
                    arrivingLocation: [value["arr-latitude"], value["arr-longitude"]] as string[],
                    driverId: thisId.studentId,
                    numAvailableSeats: value["num-of-seats"] as string
                } as postCreate,
                
            }
            fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/posts/edit-post`, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(send)
            }).then((res) => Router.reload())
        }
    }
    
    const send = {
        driverId: userId,
        userId: thisId._id,
        postId: postInfo._id
    }
    if (thisId.studentId == userId){
        return(
            <div>
                <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded" onClick={handleOpenEdit}>Edit Ride</button>
                <Modal
                    open={openEdit}
                    onClose={handleCloseEdit}
                >
                    <Box sx={postModal}>
                        <PostForm 
                            DLat={postInfo.departingLocation[0]} 
                            DLong={postInfo.departingLocation[1]} 
                            ALat={postInfo.arrivingLocation[0]} 
                            ALong={postInfo.arrivingLocation[1]} 
                            DTime={postInfo.departingTime} 
                            ASeats={postInfo.numAvailableSeats}
                        />
                        <button onClick={handleSubmit}>Edit Post</button>
                    </Box>
                </Modal>
                <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded" onClick={
                    () => {
                            fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/posts/delete-post`, {
                                method: `DELETE`,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({postId: postInfo._id})
                            }).then((res) => Router.reload())
                    }}>Cancel Ride
                </button>
                <ToggleMap postInfo={postInfo}/>
            </div>)
    }
    else if (!(isUserRiding({studentId: userId, postId: postInfo._id, userId: thisId}))) {
        const [latDepart, lngDepart] = postInfo.departingLocation.map(a=> Number(a));
        const [latArrive, lngArrive] = postInfo.arrivingLocation.map(a=> Number(a));

        const distance = haversine({lat:latDepart, lng: lngDepart}, {lat:latArrive, lng: lngArrive});

        const intDist = Math.floor(distance/ 1000); // km
        const formatQuery = `pay?distance=${intDist}`;


        
        return(<div>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded" onClick={
                () => {
                    if (passengersLength === numAvailableSeats) {
                        alert("Ride is currently full")
                    }
                    else {
                        fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/send-ride-request`, {
                            method: `POST`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(send)
                        }).then((res) => {
                            if(res.status == 201){
                                setOpen(true);
                            } else{
                                alert("Unable to send ride request, please try again at a later time")
                            }
                        })
                    }
                }}>Join Ride
            </button>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded">
                <Link href={formatQuery}>Pay ${`${Math.trunc((10 + intDist * 0.15)* 100) / 100}`}</Link>
            </button>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded" disabled={thisId.studentId === userId} onClick={(e) => {
                router.push(`/chat?sender=${thisId.studentId}&recipient=${userId}`)
            }}>Chat
            </button>
            <ToggleMap postInfo={postInfo}/>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <EnvelopeIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    Ride Request Sent!
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Your ride request has been successfully sent, please wait for the driver to accept/deny the request.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>)
    }
    else
        return (<div></div>)
}

export default function Posts() {
    const { status } = useSession({
        required: true
    })
    const {data:session} = useSession()

    const userEmail: string = session?.user?.email!
    
    const [user, setUser] = useState<postProps>()
    const [data, setData] = useState<dataProps[]>([])
    const [isLoading, setLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [page, setPage] = useState(0)

    const router = useRouter()

    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/posts/`).then((res) => res.json()).then((data: dataProps[]) => {
            const arr = data.map((obj) => {
                return {...obj, departingTime: new Date(obj.departingTime)}
            })
            const sortAscending = arr.sort(
                (objA, objB) =>  objA.departingTime.getTime() - objB.departingTime.getTime(),
            )
            const arr2 = sortAscending.map((obj) => {
                return {...obj, departingTime: obj.departingTime.toString()}
            })
            for (var i = 0; i < arr2.length; i++) {
                if (new Date(arr2[i].departingTime) > new Date()) {
                    setData(arr2.slice(i));
                    break;
                } 
            }
            setLoading(false)
        })
        if (session) {
            fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-email/${userEmail}`)
                .then((res) => res.json())
                .then((user: postProps) => {
                    setUser(user)
            })
        }
        
    }, [session, userEmail])

    function handleSubmit() {
        handleClose()
        const form = document.getElementById(`new-post`)! as HTMLFormElement
        const formData = new FormData(form);
        const value = Object.fromEntries(formData.entries())
        
        if (PostCheck(value)) {

            const send:postCreate = {
                departingTime: value["departing-time"] as string,
                departingLocation: [value["dep-latitude"], value["dep-longitude"]] as string[],
                arrivingLocation: [value["arr-latitude"], value["arr-longitude"]] as string[],
                driverId: user!.studentId,
                numAvailableSeats: value["num-of-seats"] as string
            }
            fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/posts/create-post`, {
                method: `PUT`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(send)
            }).then((res) => res.json())
        }
        Router.reload()
    }

    if(isLoading) return <p>Loading...</p>
    if(!data) return <p>No post data</p>

    if (user != undefined) {
    return (
        <>
            <Box display={"flex"} flexDirection={"column"} sx={{width: '100%', height: '100vh', overflow: 'hidden'}} className="bg-gradient-to-r from-violet-500 to-fuchsia-500">
                <NavBar/>
                <Grid container sx={{height: '100%', width: '105vw'}}>
                    <Grid item xs={2} md={3}></Grid>
                    <Grid item xs={8} md={6} >
                        <Container sx={{bgcolor: theme.palette.background.container, height: '100%', width: '100%'}}>
                            <Box display={"flex"} justifyContent={"center"} sx={{fontSize:30, fontWeight: 'bold', paddingY: 1}} className="text-3xl font-semibold tracking-tight text-slate-200">Posts</Box>
                            <Box component={"div"} sx={{height: '83vh', overflowY: 'scroll', pb: 2}}>
                                <Stack
                                    direction={"column"}
                                    alignItems={"stretch"}
                                    justifyContent={"flex-start"}
                                    spacing={1}
                                >
                                    {data.slice(0, (page+1)*10).map(d => (<div key={d._id} className="bg-purple-400 rounded-lg h-28"><Box sx={{borderRadius: 1.5, p: 1}}>
                                        <Post userId={d.driverId}></Post>
                                        <Box sx={{color: "#E2E8F0"}}>
                                            {`Driving on ${d.departingTime} [${d.numAvailableSeats - d.passengers.length}/${d.numAvailableSeats} seats left]`}
                                        </Box>
                                        <Buttons userId={d.driverId} postInfo={d} thisId={user!} numAvailableSeats={d.numAvailableSeats} passengersLength={d.passengers.length}></Buttons>
                                    
                                    </Box></div>))}
                                    
                                    <Grid container direction={"row"} alignItems={"center"} justifyContent={"center"}>
                                        <Grid item xs={6}>
                                            <Button sx={{color: "#E2E8F0"}} onClick={() => {
                                                if(!(data.slice((page+1)*10, (page+2)*10).length === 0)) {
                                                    setPage(page+1)
                                                }
                                                else
                                                    alert("Viewing last 10 upcoming rides")
                                                }}>View more results.
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button sx={{color: "#E2E8F0"}} onClick={() => {
                                                if(!(data.slice((page-1)*10, page*10).length === 0)) {
                                                    setPage(page-1)
                                                }
                                                else
                                                    alert("Viewing next 10 upcoming rides")
                                                }}>View less results.
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </Box>
                        </Container>
                    </Grid>
                    <Grid item xs={2} md={3}>
                        <Box display={"flex"} flexDirection={"row-reverse"}>
                            <Box sx={{p: 2}}>
                                <Button color={"inherit"} variant={"outlined"} onClick={handleOpen} sx={{color: theme.palette.text.contrast, fontSize: 28, fontWeight: 'bold', marginRight: '85px'}}>+</Button>
                            </Box>
                            <Modal
                                open={open}
                                onClose={handleClose}
                            >
                                <Box sx={postModal}>
                                    <PostForm DLat={""} DLong={""} ALat={""} ALong={""} DTime={""} ASeats={1}/>
                                    <button onClick={handleSubmit}>Create Post</button>
                                </Box>
                            </Modal>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )}
    else return(<div>Page Loading...</div>)

}