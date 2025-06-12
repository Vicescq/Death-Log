import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import AuthPage from "./AuthPage";

export default function Root() {
    return (
        <>
            <NavBar />
            <div className="md:mt-10 mb-10 flex flex-col items-center justify-center gap-4">
                <AuthPage/>
                {/* <Outlet /> */}
            </div>
        </>
    );
}
