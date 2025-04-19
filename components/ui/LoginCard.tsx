"use client";
import { ShieldCheck, User } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { signOut } from "next-auth/react";
import { Avatar, AvatarImage } from "./avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { setProfileImageURL } from "@redux/user/user.slice";
interface userDataInterface {
  image: string;
  id: string;
  name: string;
  tel: string;
  email: string;
  createdAt: string;
  role: string;
}
import {z} from 'zod'
const editSchema = z.object({
  tel : z.string().min(10).max(10),
  name : z.string().min(3)
})
export default function CardLogin({
  session,
  userData,
}: {
  session: any;
  userData: userDataInterface;
}) {
  const handleLogout = async () => {
    await signOut();
  };
  console.log("userData", userData);
  // alert(1)
  const handleEditUser = async () => {
    const formData = new FormData();

    const dataToSend = {
      name: changeName,
      tel: changeTel,
    };
    const isPass = editSchema.safeParse(dataToSend)
    if(!isPass.success){
      alert(
        "The information you entered doesn't look right. Please double-check your User details.",
      );
      return;
    }
    console.log("dataToSend", dataToSend);
    formData.append("userData", JSON.stringify(dataToSend));
    if (profileImageState) {
      formData.append("profileImage", profileImageState);
    }
    const response = await axios.put(
      `http://localhost:5000/api/v1/users/update-user/${userData.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.success) {
      setChangeName(response.data.data?.user?.name);
      setChangeTel(response.data.data?.user?.tel);
      setImageState({
        image: response.data.data?.url ?? "/",
      });
      alert("successfully update this user");
    } else {
      alert("failed to update this user");
    }
  };
  useEffect(() => {
    if (session.provider !== "credentials") {
      setChangeName(session.user.name)
      setChangeTel(session.user.tel)
      return;
    }
    const handleFetchUser = async () => {
      
      const email = userData.email;

      const res = await axios.post(
        `http://localhost:5000/api/v1/users/findUser`,
        {
          email,
        }
      );
      console.log("res data", res);
      setChangeName(res.data.data?.name);
      setChangeTel(res.data.data?.tel);
      if (
        res.data.data?.profileImageKey &&
        res.data.data?.profileImageKey !== "/"
      ) {
        setImageState({
          image: res.data.data?.profileImageKey,
        });
      }
    };
    handleFetchUser();
  }, []);
  const [isEdit, setIsEdit] = useState(false);
  const [changeName, setChangeName] = useState("");
  const [changeTel, setChangeTel] = useState("");
  const [img, setImageState] = useState({
    image: userData.image ?? "",
  });
  console.log("img", img);
  const [profileImageState, setProfileImageState] = useState<File | null>(null);
  console.log("ession", session);
  const onImageChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageState(e.target.files[0]);
      setImageState({
        image: URL.createObjectURL(e.target.files[0]),
      });
      setIsEdit(true);
    }
  };
  return (
    <Card>
      <CardHeader className="w-full relative">
        <CardTitle className="text-3xl">Profile Card</CardTitle>
        {!userData?.role || userData?.role == "user" ? (
          <User className="absolute right-3 top-0" size={60} />
        ) : (
          <ShieldCheck className="absolute right-3 top-0" size={60} />
        )}
      </CardHeader>
      <CardContent className="relative h-[650px] w-[600px] flex flex-col justify-start items-center">
        <div>
          {isEdit ? (
            <div className="relative flex flex-col justify-start items-center">
              <Avatar className="size-40 border border-black">
                <AvatarImage
                  src={
                    profileImageState
                      ? URL.createObjectURL(profileImageState)
                      : img.image && img.image !== "/"
                      ? img.image
                      : "/" // <- replace with your own fallback image path if needed
                  }
                />
              </Avatar>
              <input
                id="picture"
                type="file"
                accept=".png, .jpeg, .gif, .webp"
                className="border border-black hover:bg-blue-400 bg-blue-200"
                onChange={onImageChange}
              />
            </div>
          ) : (
            <Avatar className="size-40 border border-black">
                <AvatarImage
                  src={
                    profileImageState
                      ? URL.createObjectURL(profileImageState)
                      : img.image && img.image !== "/"
                      ? img.image
                      : "/"
                  }
                />
              </Avatar>
          )}
        </div>

        <div>
          {isEdit ? (
            <div className="flex flex-col mt-5 gap-3 text-2xl font-bold">
              <input
                type="text"
                value={changeName}
                onChange={(e) => setChangeName(e.target.value)}
              />
              <input
                type="text"
                value={changeTel}
                onChange={(e) => setChangeTel(e.target.value)}
              />
              <span>Email : {userData?.email ?? "No Data"}</span>
              {/* <span>Created At : {userData?.createdAt ?? "No Data"}</span> */}
              <span>Role : {!userData?.role ? "user" : userData?.role}</span>
              <button
                onClick={() => setIsEdit(false)}
                className="w-full mt-5 h-[40px] text-lg bg-red-400"
              >
                cancle edit
              </button>
              <button
                onClick={async () => {
                  await handleEditUser();
                  setIsEdit(false);
                }}
                className="w-full mt-5 h-[40px] text-lg bg-blue-400"
              >
                confirm edit
              </button>
            </div>
          ) : (
            <div className="flex flex-col mt-5 gap-3 text-2xl font-bold">
              <span>Name : {changeName ?? "Unknown"}</span>
              <span>Tel : {changeTel ?? "No Data"}</span>
              <span>Email : {userData?.email ?? "No Data"}</span>
              {/* <span>Created At : {userData?.createdAt ?? "No Data"}</span> */}
              <span>Role : {!userData?.role ? "user" : userData?.role}</span>
              {session.provider === "credentials" ? (
                <button
                  onClick={() => setIsEdit(true)}
                  className="w-full mt-5 h-[40px] text-lg bg-yellow-400"
                >
                  edit
                </button>
              ) : (
                ""
              )}
            </div>
          )}

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
