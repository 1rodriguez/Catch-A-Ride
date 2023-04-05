import { useSession } from "next-auth/react"
import NavBar from '../../../components/navbar'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from "next/router"
import Link from "next/link"


type displayProps= {
    displayName: string,
    email: string,
    gender: string,
    reviews: [review],
    _id: string,
    studentId: number,
    firstName: string,
    lastName: string,
    phoneNumber: string,
}

type review = {
    reviewerEmail: string,
    role: string,
    text: string,
    _id: string,
    rating: number,
}

export default function EditProfile() {
    const { status } = useSession({
        required: true
    })
    const { data:session } = useSession()
    const userEmail = session?.user?.email;
    const userId = session?.user?.id;
    const userProfile = `/auth/profile/${userEmail}`;
    const router = useRouter()

    // fetch user data
    const [data, setData] = useState<displayProps>()
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        if (session){
            fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-email/${userEmail}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
        }
    }, [session, userEmail])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    if (data._id != userId) return <p>ERROR: Session ID does not match userID</p>

    // send info to backend
    const updateUser = async (event:any) => {
        event.preventDefault();
        const userId = event.target.userId.value;
        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const displayName = event.target.displayName.value;
        const phoneNumber = event.target.phoneNumber.value;
        const gender = event.target.gender.value;
        const res = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/update-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId":userId,
                "update": {
                    "firstName":firstName,
                    "lastName":lastName,
                    "displayName":displayName,
                    "phoneNumber":phoneNumber,
                    "gender":gender
                }
            })
        });

        router.reload();
    };

    return (
        <>
        <NavBar/>
        <main className="grid min-h-screen place-items-center bg-gradient-to-r from-violet-500 to-fuchsia-500 py-24 px-6 sm:py-32 lg:px-8">
            <form onSubmit={updateUser}>
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="ml-24 text-3xl font-bold leading-7 text-slate-200">Welcome {data.displayName}! Edit your profile below.</h2>
                    <input hidden id="userId" type='text' readOnly value={userId}/>
                    <div className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="first-name" className="block text-left text-sm font-medium leading-6 text-gray-900">
                                First Name
                            </label>
                            <div className="mt-2">
                                <input
                                type="text"
                                name="first-name"
                                id="firstName"
                                autoComplete="given-name"
                                defaultValue={data.firstName}
                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-left text-sm font-medium leading-6 text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                type="text"
                                name="last-name"
                                id="lastName"
                                autoComplete="last-name"
                                    defaultValue={data.lastName}
                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="display-name" className="block text-left text-sm font-medium leading-6 text-gray-900">
                                Display Name
                            </label>
                            <div className="mt-2">
                                <input
                                type="text"
                                name="display-name"
                                id="displayName"
                                autoComplete="display-name"
                                    defaultValue={data.displayName}
                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="phone-number" className="block text-left text-sm font-medium leading-6 text-gray-900">
                                Phone Number
                            </label>
                            <div className="mt-2">
                                <input
                                type="text"
                                name="phone-number"
                                id="phoneNumber"
                                autoComplete="phone-number"
                                    defaultValue={data.phoneNumber}
                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="gender" className="block text-left text-sm font-medium leading-6 text-gray-900">
                                Gender
                            </label>
                            <div className="mt-2">
                                <select
                                id="gender"
                                name="gender"
                                autoComplete="gender"
                                defaultValue={data.gender}
                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Non-Binary</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 mx-80 mt-5 py-2 px-8 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    > Save
                </button>
                <div className="flex flex-row">
                    <div className="basis-1/2">
                        <Link href={userProfile}><button className="rounded-md bg-indigo-600 ml-20 mt-5 py-2 px-8 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View Profile as User</button></Link><br/><br/>
                    </div>
                    <div className="basis-1/2">
                        <Link href="/requests"><button className="rounded-md bg-indigo-600 ml-20 mt-5 py-2 px-8 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View Ride Requests</button></Link>
                    </div>
                </div>
            </form>
        </main>
       
        </>
    )
}
