import { useSession } from "next-auth/react"
import NavBar from '../components/navbar'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from "next/router"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type dataProps = {
    _id: string,
    driverId: number,
    departingLocation: string[],
    departingTime: string,
    arrivingLocation: string[],
    numAvailableSeats: number
}

type driverInfo = {
    firstName: string,
    lastName: string,
    displayName: string,
    studentId: string,
    email: string,
    emailVerified: string,
    phoneNumber: string,
}

function RenderRides({data, drivers} : {data:dataProps[], drivers: Map<number, driverInfo>}){
    return (
      <TableContainer component={Paper} className="min-h-screen place-items-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow> 
              <TableCell style={{color: "#E2E8F0"}}>Your Ride History</TableCell>
              <TableCell style={{color: "#E2E8F0"}} align="center">Driver</TableCell>
              <TableCell style={{color: "#E2E8F0"}} align="center">Driver Name</TableCell>
              <TableCell style={{color: "#E2E8F0"}} align="center">Driver Phone Number</TableCell>
              <TableCell style={{color: "#E2E8F0"}} align="center">Departing Location</TableCell>
              <TableCell style={{color: "#E2E8F0"}} align="center">Arriving Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((ride) => (
              <TableRow
                key={ride._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" style={{color: "#E2E8F0"}}>
                  {new Date(ride.departingTime).toDateString()}
                </TableCell>
                <TableCell style={{color: "#E2E8F0"}} align="center">{drivers.get(ride.driverId)?.displayName}</TableCell>
                <TableCell style={{color: "#E2E8F0"}} align="center">{drivers.get(ride.driverId)?.firstName}</TableCell>
                <TableCell style={{color: "#E2E8F0"}} align="center">{drivers.get(ride.driverId)?.phoneNumber}</TableCell>
                <TableCell style={{color: "#E2E8F0"}} align="center">{ride.departingLocation}</TableCell>
                <TableCell style={{color: "#E2E8F0"}} align="center">{ride.arrivingLocation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
export default function RideHistory(){
    const { status } = useSession({
        required: true
    })
    const {data:session} = useSession()
    const userId = session?.user?.id;


    // fetch ride history
    const [data, setData] = useState<dataProps[]>([])
    const [drivers, setDrivers] = useState(new Map<number, driverInfo>())
    
    const [isLoading, setLoading] = useState(false)

    const isMounted = useRef(false);
    useEffect(() => {
        setLoading(true)
        const updateMap = (k: number,v: driverInfo) => {
          setDrivers(new Map(drivers.set(k,v)));
        }

        if (isMounted.current){
            fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-ride-history/${userId}`)
            .then((res) => res.json())
            .then((rides) => {
                rides.forEach((ride: any) => {
                    if(!drivers?.has(ride.driverId)){
                        fetch(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/users/get-user-by-student-id/${ride.driverId}`).then((res) => res.json()).then(user => {
                            updateMap(ride.driverId, user)
                        })
                    }
                });
                setData(rides)
                setLoading(false)
            });
        }
        else{
            isMounted.current = true;
        }
    }, [drivers, userId])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No ride history</p>
    
    return(
        <><link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /><><NavBar />
                <RenderRides data={data} drivers={drivers}/>
            </></>
    )


}