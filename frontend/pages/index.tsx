import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import NavBar from '../components/navbar'

import Messages from './chat'
import Payment from './pay'
import { ClassNames } from '@emotion/react'

type dataProps = {
  _id: string,
  uid: number,
  text: string,
  date: string
}

export default function Home() {
  
  const [data, setData] = useState<dataProps[]>([])
  const [isLoading, setLoading] = useState(false)

  if(isLoading) return <p>Loading...</p>
  if(!data) return <p>No post data</p>

  return (
    <>
      <NavBar/> 
      <main className="grid min-h-screen place-items-center bg-gradient-to-r from-violet-500 to-fuchsia-500 py-24 px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <div className="ml-60 mb-20 h-48 w-96">
             <Image
              className="object-cover"
              src="/westernlogo.png"
              alt="Western Logo"
              width={500}
              height={500}
            />
          </div>
         
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-200 sm:text-5xl">Welcome to Catch A Ride!</h1>
          <p className="mt-6 text-base leading-7 text-slate-200">Catch A Ride aims to connect Western students driving all across the GTA!</p>
          <h2 className="mt-4 text-1xl text-slate-200 font-bold tracking-tight">Tired of scrolling endlessly on Facebook to view rides? Scroll no more as all rides are shown in chronological order.</h2>
          <h2 className="mt-4 text-1xl text-slate-200 font-bold tracking-tight">Hate dealing with e-transfers? Pay directly through the website! No more haggling for both drivers and riders.</h2>
          <h2 className="mt-4 text-1xl text-slate-200 font-bold tracking-tight">Had a bad experience? Leave a review so that riders/drivers can be aware of bad people.</h2> 

           <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
                href="mailto:catcharideservice@gmail.com"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Contact Support
              </a>
          </div>
        </div>
       
      </main>
    </>
  )
}
