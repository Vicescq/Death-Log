import { NavLink, Outlet } from "react-router";

export default function Root() {

    return (
        <>
            <div className="flex items-center justify-center gap-2 m-8">
                <NavLink to={"/"}>
                    <div className="border-2 p-1 rounded-md">Go back home</div>
                </NavLink>
                <Outlet />
            </div>
        </>
    )
}