import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link'

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <nav className="relative flex w-full flex-nowrap items-center justify-between bg-violet-600 py-4 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 lg:flex-wrap lg:justify-start" data-te-navbar-ref="">
          <div className="flex w-full flex-wrap items-center justify-between px-6">
            <div className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto" id="navbarSupportedContent3" data-te-collapse-item="">
              <Link href="/" className="py-2 px-2 text-slate-200 font-semibold hover:text-violet-300 transition duration-300">Catch A Ride</Link>
              <div className="flex md:flex md:flex-grow flex-row justify-end space-x-1">
                <Link href="/posts" className="py-2 px-2 text-slate-200 font-semibold hover:text-violet-300 transition duration-300">Posts</Link>
                <Link href="/auth/profile/edit-profile" className="py-2 px-2 text-slate-200 font-semibold hover:text-violet-300 transition duration-300">Profile</Link>
                <Link href="/ride-history" className="py-2 px-2 text-slate-200 font-semibold hover:text-violet-300 transition duration-300">Ride History</Link>
                <Link href="" className="py-2 px-2 text-slate-200 font-semibold hover:text-violet-300 transition duration-300" onClick={() => signOut()}> Sign Out</Link>
              </div>
            </div>
          </div>
        </nav>
      </>
    )
  }
  return (
    <>
      <nav className="relative flex w-full flex-nowrap items-center justify-between bg-violet-600 py-4 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 lg:flex-wrap lg:justify-start" data-te-navbar-ref="">
        <div className="flex w-full flex-wrap items-center justify-between px-6">
          <div className="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto" id="navbarSupportedContent3" data-te-collapse-item="">
            <Link href="/" className="py-2 px-2 text-white-200 font-semibold hover:text-violet-300 transition duration-300">Catch A Ride</Link>
            <div className="flex md:flex md:flex-grow flex-row justify-end space-x-1">
              <Link href="" className="py-2 px-2 text-slate-200 font-semibold hover:text-violet-300 transition duration-300" onClick={() => signIn()}> Sign In</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}