"use client";
import { ShieldCheck, User } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarImage } from "./avatar";
interface userDataInterface {
    image: string,
    _id : string,
    name : string,
    tel : string,
    email : string,
    createdAt : string,
    role : string,
}
export default function CardLogin({
  session,
  userData,
}: {
  session: any;
  userData: userDataInterface;
}) {
    const handleLogout = async () => {
        await signOut()
    }
    // alert(1)
    
  return (
    <Card>
      <CardHeader className='w-full relative'>
        <CardTitle className='text-3xl'>Profile Card</CardTitle>
        {
          !userData?.role || userData?.role == 'user' ? <User className='absolute right-3 top-0' size={60}/> : <ShieldCheck className='absolute right-3 top-0' size={60}/>
        }
      </CardHeader>
      <CardContent className='relative h-[500px] w-[600px] flex flex-col justify-start items-center'>
        
        <Avatar className={`size-40 border border-black ${userData?.image !=='/' ? "" : "bg-black"}`}>
          <AvatarImage src={userData?.image ?? "/"} />
        </Avatar>
        
        <div className='flex flex-col mt-5 gap-3 text-2xl font-bold'>
            <span>Name : {userData?.name  ?? "Unknown"}</span>
            <span>Tel : {userData?.tel == "" ? "No Data" : userData?.tel ?? "No Data"}</span>
            <span>Email : {userData?.email ?? "No Data"}</span>
            <span>Created At : {userData?.createdAt ?? "No Data"}</span>
            <span>Role : {!userData?.role ? "user" : userData?.role}</span>
            <Button
          variant={"destructive"}
          onClick={handleLogout}
           className="w-full mt-5 h-[40px] text-lg hover:bg-red-400"
        >
          Logout
        </Button>
        </div>
        {/* <Button onClick={async () => fetchInstagramProfile(accessToken)}></Button> */}
        
      </CardContent>
      
    </Card>
  );
}
