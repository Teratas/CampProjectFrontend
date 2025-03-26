import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LogoutLayout({children} : {children : React.ReactNode}) {
    const session = await auth()
    if(session?.user){
        redirect('/home')
    }
    return (
        <div>
            {children}
        </div>
    )
}