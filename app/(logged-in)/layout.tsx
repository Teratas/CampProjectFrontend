import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomeLayout({children} : {children: React.ReactNode}){
    const session = await auth();
    if(!session?.user){
        redirect('http://localhost:3000/login')
    }
    return (
        <>
            {children}
        </>
    )

}