import { useSession } from "next-auth/react"
import NavBar from '../components/navbar'
import { useState, useEffect } from 'react'
import Router from 'next/router';
import Link from 'next/link';

type userProps = {
  _id: string,
  studentId: number,
  firstName: string,
  lastName: string,
  displayName: string,
  email: string,
  emailVerified: string,
  phoneNumber: string,
  rideRequests: [{
    postId: string,
    userId: string,
    accepted: boolean
  }]
}

type postProps = {
    _id: string,
    driverId: number,
    departingLocation: string[],
    departingTime: string,
    arrivingLocation: string[],
    numAvailableSeats: number
    passengers: number[]
}


export default function Requests() {
  const { status } = useSession({
    required: true
  })
  const {data:session} = useSession()
  const userEmail = session?.user?.email;

  const [user, setUser] = useState<userProps>()
  const [passengers, setPassengers] = useState(new Map<string, userProps>());
  const [posts, setPosts] = useState(new Map<string, postProps>());


  useEffect(() => {
      const updatePassengers = (k: string,v: userProps) => {
        setPassengers(new Map(passengers.set(k,v)));
      }
      const updatePosts = (k: string,v: postProps) => {
        setPosts(new Map(posts.set(k,v)));
      }
      if(userEmail){
        fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-email/${userEmail}`).then((res) => res.json()).then((user: userProps) => {
        const unacceptedRidReq = user.rideRequests?.filter(d => d.accepted === false);
        unacceptedRidReq.forEach(rideReq => {
          fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-id/${rideReq.userId}`).then(res => res.json()).then((user: userProps) => {
            updatePassengers(user._id, user);
          });
          fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/posts/get-post/${rideReq.postId}`).then(res => res.json()).then((post: postProps) => {
            updatePosts(rideReq.postId, post);
          });
        })
        setUser(user)
        })
      }
  }, [userEmail])

  if(!user) return <p>No requests</p>

  const arr = user.rideRequests?.filter(d => d.accepted === false)
  
  return (  
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div style={{textAlign:'center'}}>
          <h1 className="pt-24 font-bold tracking-tight text-slate-200 sm:text-5xl">{userEmail?.split('@')[0]}&apos;s Ride Requests</h1>
        </div>

        <div className="mt-10 grid grid-cols-1 justify-items-stretch">
          {arr?.map(d => (<div key={d.postId} className="mt-2 justify-self-center bg-purple-400 rounded-lg h-18 px-4 py-4 text-slate-200">
             <Link  className="font-bold" style={{color:"#4338ca"}} href={`/auth/profile/${passengers.get(d.userId)?.email}`}>{passengers.get(d.userId)?.displayName}</Link>
            {` wishes to join ride departing on ${new Date(posts.get(d.postId)?.departingTime!).toDateString()}
            at ${new Date(posts.get(d.postId)?.departingTime!).toLocaleTimeString("en-US")}`}
            <div>
              <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded"onClick={() => {
                fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/accept-ride-request`, {
                  method: `POST`,
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    studentId: user.studentId,
                    postId: d.postId,
                    userId: d.userId
                  })
                }).then((res) => Router.reload())
              }}>Accept</button>

              <button className="bg-indigo-500 hover:bg-indigo-700 text-slate-200 font-semibold mr-3 mt-2 py-2 px-2 rounded" onClick={() => {
                fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/delete-ride-request`, {
                  method: `DELETE`,
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    studentId: user.studentId,
                    postId: d.postId,
                    userId: d.userId
                  })
                }).then((res) => Router.reload())
              }}>Deny</button>
            </div>
          </div>))}
        </div>
      </div>
    </>
  )

}