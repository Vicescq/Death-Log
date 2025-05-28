import { Outlet } from "react-router";
import NavBar from "../components/NavBar";


export default function Root() {

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center gap-4 mt-10 mb-10">
                <Outlet />
            </div >
        </>
    )
}