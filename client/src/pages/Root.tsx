import { Outlet } from "react-router";
import NavBar from "../components/NavBar";


export default function Root() {

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center gap-2 m-10">
                <Outlet />
            </div >
        </>
    )
}