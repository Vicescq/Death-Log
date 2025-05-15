import { NavLink, useLocation } from "react-router"
import type Collection from "../classes/Collection"



export default function Card<T>({ objContext, index }: { objContext: Collection<T>, index: number }) {




    return (
        <>
            <NavLink to={`/${objContext.name}`} state={{index}}>
                <div className="flex rounded-lg border p-3 gap-2 cursor-pointer">
                    {objContext.name}
                </div>
            </NavLink>
        </>
    )
}