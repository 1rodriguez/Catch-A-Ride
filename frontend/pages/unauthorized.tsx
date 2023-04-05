import NavBar from "../components/navbar"
import Link from "next/link"

export default function Unauthorized() {
    return (
        <>
            <NavBar/>
            <div style={{textAlign:'center'}}>
                <h1>Unauthorized Login</h1>
                <p>Either you tried to log in with a non-uwo email, or your account is banned.</p>
                <p>Contact support at catcharideservice@gmail.com for additional information.</p><br/>
                <Link href="/"><button>Return to HomePage</button></Link>
            </div>
        </>
    )
}