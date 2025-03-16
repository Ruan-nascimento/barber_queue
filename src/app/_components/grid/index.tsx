import { ReactNode } from "react"

export const Grid = ({children}:{children:ReactNode}) => {
    return(
        <div className="bg-zinc-700 w-56 p-6 rounded-lg shadow-md mb-8 transform transition-all duration-300 hover:shadow-lg">
            {children}
        </div>
    )
}