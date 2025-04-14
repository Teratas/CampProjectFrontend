"use client";
import { ShieldCheck, User } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarImage } from "./avatar";
import { useState } from 'react';
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
    const [isEdit, setIsEdit] = useState(false);
    const [changeName, setChangeName] = useState(userData.name);
    const [changeTel, setChangeTel] = useState(userData.tel);
    const [img, setImageState] =useState({
      image: userData.image?? "",
  });
  const [profileImageState, setProfileImageState] = useState<File | null>(null);
  
    const onImageChange = async (e: any) => {
      if(e.target.files && e.target.files[0]){
          // if(e.target.files[0].size > 5 * 1024 * 1024){
          //     // toast({
          //     //     variant: "destructive",
          //     //     title: "Limit File Size",
          //     //     description: "File Size Exceed 5 Mb",
          //     // });
          //     return;
          // }
          setProfileImageState(e.target.files[0]);
          setImageState({
              image: URL.createObjectURL(e.target.files[0]),
          });
          setIsEdit(true);
      }
  };
  return (
    <Card>
      <CardHeader className='w-full relative'>
        <CardTitle className='text-3xl'>Profile Card</CardTitle>
        {
          !userData?.role || userData?.role == 'user' ? <User className='absolute right-3 top-0' size={60}/> : <ShieldCheck className='absolute right-3 top-0' size={60}/>
        }
      </CardHeader>
      <CardContent className='relative h-[500px] w-[600px] flex flex-col justify-start items-center'>
        
        <div >
          {isEdit ?
          <div className='relative flex flex-col justify-start items-center'>
            <Avatar className={`size-40 border border-black ${userData?.image !=='/' ? "" : "bg-black"}`}>
          
          
          <AvatarImage src={img.image ?? "/"} />
        
          </Avatar><input id="picture"
          type="file"
          accept=".png, .jpeg, .gif, .webp"
          className="border border-black hover:bg-blue-400 bg-blue-200"
          onChange={onImageChange}/>
          </div>          
          :
          <Avatar className={`size-40 border border-black ${userData?.image !=='/' ? "" : "bg-black"}`}>
        
          </Avatar>

          }
        </div>
        
        
        <div>
            {
              isEdit ? 
              <div className='flex flex-col mt-5 gap-3 text-2xl font-bold'>
                <input type="text" value={changeName} onChange={(e) => setChangeName(e.target.value)} />
                <input type="text" value={changeTel} onChange={(e) => setChangeTel(e.target.value)} />
                <span>Email : {userData?.email ?? "No Data"}</span>
                {/* <span>Created At : {userData?.createdAt ?? "No Data"}</span> */}
                <span>Role : {!userData?.role ? "user" : userData?.role}</span>
                <button onClick={() => setIsEdit(false)} className="w-full mt-5 h-[40px] text-lg bg-red-400">cancle edit</button>
                <button onClick={() => setIsEdit(false)} className="w-full mt-5 h-[40px] text-lg bg-blue-400">confirm edit</button>
              </div>   
              : <div className='flex flex-col mt-5 gap-3 text-2xl font-bold'>
                  <span>Name : {changeName ?? "Unknown"}</span>
                  <span>Tel : {changeTel ?? "No Data"}</span>
                  <span>Email : {userData?.email ?? "No Data"}</span>
                  {/* <span>Created At : {userData?.createdAt ?? "No Data"}</span> */}
                  <span>Role : {!userData?.role ? "user" : userData?.role}</span>
                  <button onClick={() => setIsEdit(true)} className="w-full mt-5 h-[40px] text-lg bg-yellow-400">edit</button>
                </div>
            }
           

            
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
