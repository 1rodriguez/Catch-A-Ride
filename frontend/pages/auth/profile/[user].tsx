import NavBar from '../../../components/navbar'
import { useState, useEffect } from 'react'
import { useRouter } from "next/router"
import { Rating } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { Fragment, useRef} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { StarIcon as StarIcon2 } from '@heroicons/react/24/outline'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    color: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

type displayProps = {
    displayName: string,
    email: string,
    gender: string,
    reviews: [review]
}

type review = {
    reviewerEmail: string,
    role: string,
    text: string,
    _id: string,
    rating: number,
}

export default function Profile() {
    const router = useRouter()
    const { data:session } = useSession()
    // fetch user data
    const [data, setData] = useState<displayProps>()
    const [isLoading, setLoading] = useState(false)
    const { user } = router.query
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<number | null>(2);
    const cancelButtonRef = useRef(null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setLoading(true)
        if(user){
            fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-email/${user}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
        }
       
    }, [user])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    
    // post review to backend
    const postReview = async (event:any) => {
        event.preventDefault();
        const email = user;
        const reviewerEmail = session?.user?.email;
        const role = event.target.role.value; 
        const rating = value; 
        const text = event.target.text.value;

        const res = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/post-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email":email,
                "reviewerEmail":reviewerEmail,
                "role":role,
                "rating":rating,
                "text":text
            })
        });

        router.reload();
    };

    return (
        <>
        <NavBar/>
        <div style={{textAlign:'center'}} className="min-h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
            <h1 className="pt-28 text-3xl font-bold tracking-tight text-slate-200 sm:text-5xl">{data.displayName}&apos;s Reviews</h1>
            <p className="text-1xl font-bold tracking-tight text-slate-200">Email: {data.email}</p>
            
            {(session) && <>
                <div className="mt-5 pb-5 flex items-center justify-center gap-x-6">
                    <button onClick={handleOpen} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-slate-200 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> Leave A Review </button>
                </div>
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
                                    <form onSubmit={postReview}>
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <StarIcon2  className="h-6 w-6 text-indigo-600" />
                                                </div>
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Rate {data.displayName}
                                                    </Dialog.Title>
                                                    <Rating
                                                        id='rating'
                                                        value={value}
                                                        onChange={(event, newValue) => {
                                                        setValue(newValue);
                                                        }}
                                                    /> <br/>
                                                    <div className="mt-2 text-m text-gray-900">
                                                        <label
                                                            htmlFor="role"
                                                            className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                                        >
                                                        {data.displayName} was your 
                                                        </label>
                                                        <select
                                                            id="role"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        >
                                                            <option value="Passenger">Passenger</option>
                                                            <option value="Driver">Driver</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex justify-cente mt-5">
                                                        <div className="relative mb-3 xl:w-96" data-te-input-wrapper-init="">
                                                            <textarea
                                                            className="peer block min-h-[auto] w-full rounded border-0 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                                            id="text"
                                                            rows={3}
                                                            placeholder="Your message"
                                                            defaultValue={""}
                                                            />
                                                            <label
                                                            className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-neutral-200"
                                                            >
                                                            Comments
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Click &apos;Submit&apos; to leave your review
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                        </div>
                                    </Dialog.Panel>
                                    </form>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </>}
            
            <ul className='pb-6'>
                { data.reviews.map((review) => (
                    <li
                    key={review._id}
                    style={{marginLeft:"38%"}}
                    className="box max-w-sm p-6 mt-5 bg-purple-600 rounded-lg shadow hover:bg-purple-400"
                    >
                       <Rating value={review.rating} readOnly emptyIcon={<StarIcon fontSize="inherit" />}/> <br/>
                       <p className="font-normal text-slate-200"> {data.displayName} was <Link style={{padding:0, color:'blue'}} href={`/auth/profile/${review.reviewerEmail}`}>{review.reviewerEmail}</Link>&apos;s {review.role} </p>
                       <p className="font-normal text-slate-200">&quot;{review.text}&quot; </p>
                    </li>
                ))}
            </ul>

        </div>
        </>
    )
}
