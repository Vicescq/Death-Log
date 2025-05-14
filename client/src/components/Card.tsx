import { NavLink, useLocation } from "react-router"
import type Collection from "../classes/Collection"
import type Game from "../classes/Game"

export default function Card<T>({ objContext }: { objContext: Collection<T> }) {
  

    

    return (
        <>
            <NavLink to={`/${objContext.name}`} state={objContext}>
                <div className="flex rounded-lg border p-3 gap-2 cursor-pointer">
                    {objContext.name}
                </div>
            </NavLink>
        </>
    )
}