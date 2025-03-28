"use client"
import {z} from 'zod';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@redux/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useToast} from '@hooks/use-toasts';
import { setProfileImageURL, setUser } from '@redux/user/user.slice';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@mui/material";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().optional(),
    telephone: z.string().optional(),
    email: z.string().email().max(100, "email too long")
})

type formType = z.infer<typeof formSchema>;
export default function UserProfilePage(){
    const user: any = useSelector<RootState>((state) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const userData: any = user.user;
    const form = useForm<formType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: userData?.name ?? "",
            telephone: userData?.tel ?? "",
            email: userData?.email ?? ""
        },
    });

    useEffect(()=>{
        if(userData){
            form.reset({
                name: userData.email ?? "",
                telephone: userData.tel ?? "",
                email: userData.email ?? ""
            });
        }
    },[userData, form.reset]);

    const [isEdit, setIsEdit] = useState(false);
    const [click, setClick] = useState(0);
    const {toast} = useToast();

    const handleSubmit = async (data: formType) => {
        const formData = new FormData();

        const sendUserData ={
            ...userData,
            name: data.name,
            tel: data.telephone,
            email:data.email
        };
        if(profileImageState) {
            formData.append("profileImage", profileImageState);
        };
        const userFormData = formData;
        userFormData.append('userData', JSON.stringify(sendUserData));
        const id = user.user._id;
        const token = user.token;
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-user/${id}`;
        const returnUser = await axios.put(
            apiUrl,
            userFormData,
            {
                withCredentials: true,
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        console.log(returnUser)
        if(!returnUser){
            toast({
                variant: "destructive",
                title: "Edit Profile",
                description: "Failed to Edit User",
            });
            return;
        }
        if(returnUser.data.data.status == 'error'){
            toast({
                variant: "destructive",
                title: "Edit Profile",
                description: returnUser.data.data ?? "Failed to Edit User"
            });
            return;
        }

        toast({
            variant: "default",
            title: "Edit Profile",
            description: "Edit Profile Successful",
        })
        dispatch(setUser(returnUser.data.data.updatedUser));
        if(returnUser?.data?.data?.url){
            dispatch(setProfileImageURL(returnUser?.data?.data?.url));
            setImageState({
                image: returnUser?.data?.data?.url ?? "",
            });
            setProfileImageState(null);
        }
        setIsEdit(false);
    };

    const [loadingImage, setLoadingImage] = useState(false);
    const [img, setImageState] =useState({
        image: user.profileImageURL?? "",
    });
    const [profileImageState, setProfileImageState] = useState<File | null>(null);
    const onImageChange = async (e: any) => {
        if(e.target.files && e.target.files[0]){
            if(e.target.files[0].size > 5 * 1024 * 1024){
                toast({
                    variant: "destructive",
                    title: "Limit File Size",
                    description: "File Size Exceed 5 Mb",
                });
                return;
            }
            setProfileImageState(e.target.files[0]);
            setImageState({
                image: URL.createObjectURL(e.target.files[0]),
            });
            setIsEdit(true);
        }
    };

    const router = useRouter();
    return(
        <main className="h-[100vh]">
            <Card>
                <CardHeader>
                    <CardTitle className='flex justify-center text-3xl lg:text-2xl lg:justify-start w-full'>Profile</CardTitle>
                </CardHeader>
                <CardContent className=" flex flex-col items-center">
            <div className="mt-5 lg:mt-0 order-2 lg:order-1 text-2xl lg:text-xl text-center font-bold flex justify-center h-[50px] items-center">
              {userData.firstName} {userData.middleName} {userData.lastName}
            </div>
            {loadingImage ? (
              <Avatar className="order-1 lg:order-2 bg-slate-400 flex justify-center items-center">
                <CircularProgress size={60} />
              </Avatar>
            ) : (
              <Avatar className="order-1 lg:order-2 size-80 lg:size-60">
                <AvatarImage src={img.image} alt="" />
                <AvatarFallback className=" border border-black rounded-full"></AvatarFallback>
              </Avatar>
            )}
            
            <div className="mt-5 lg:mt-0 order-3 lg:order-2 lg:w-full lg:flex flex-col items-center justify-center">
              <label
                htmlFor="picture"
                className="mt-5 w-[50%] bg-blue-500 text-white text-xl py-2 px-4 rounded-lg cursor-pointer text-center"
              >
                Upload File
              </label>
              <input
                id="picture"
                type="file"
                accept=".png, .jpeg, .gif, .webp"
                className="hidden"
                onChange={onImageChange}
              />
            </div>
            {/* <div className='flex items-start order-6  bottom-0 w-[90%] left-[50%] translate-x-[-50%]  h-[20vh] absolute lg:hidden'>
              <div className='bg-white flex justify-between items-center w-full rounded-xl h-[20%]'>
                <div onClick={() => setMobilePageState(0)} className={`${mobilePageState == 0 ? "bg-slate-300" : ""} cursor-pointer ${(user.user.role === 'production professional') ? "w-[33%]" : "w-[50%]"} h-full flex justify-center items-center rounded-lg`}>Profile Image</div>
                <div onClick={() => setMobilePageState(1)} className={`${mobilePageState == 1 ? "bg-slate-300" : ""} cursor-pointer ${(user.user.role === 'production professional') ? "w-[33%]" : "w-[50%]"} h-full flex justify-center items-center rounded-lg`}>Edit Profile</div>
                {(user.user.role === 'production professional') ? 
                  <div onClick={() => setMobilePageState(2)} className={`${mobilePageState == 2 ? "bg-slate-300" : ""} cursor-pointer w-[33%] h-full flex justify-center items-center rounded-lg`}>Review</div>
                :""}
              </div>
            </div> */}
          </CardContent>
            </Card>
            <Card>
                <CardHeader className="h-[17%] lg:h-[10%] flex items-start justify-end">
                    <CardTitle className=''>Edit Profile ({user.user.role})</CardTitle>
                </CardHeader>
                <CardContent className="h-[65%] w-full lg:w-[500px] flex flex-col relative lg:h-full">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="h-[50%] "
                        >
                        <fieldset
                            disabled={form.formState.isSubmitting}
                            className="h-[100%] flex items-start"
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                <FormItem className="w-[40%]">
                                    <FormLabel className="">name</FormLabel>
                                    <FormControl>
                                        <Input disabled={!isEdit} {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                name="telephone"
                                control={form.control}
                                render={({ field }) => (
                                <FormItem className="w-[40%]">
                                    <FormLabel className="">telephone</FormLabel>
                                    <FormControl>
                                        <Input disabled={!isEdit} {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

<div
                      className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEdit ? "justify-between" : "justify-end"}`}
                    >
                      <Button
                        className={`${isEdit ? "" : "hidden"}  w-[40%] lg:w-[30%] text-white bg-green-400 hover:bg-green-500`}
                        type="submit"
                        onSubmit={form.handleSubmit(handleSubmit)}
                      >
                        Update Info
                      </Button>
                      <Button
                        variant={`${isEdit ? "destructive" : "default"}`}
                        type="reset"
                        onClick={() => setIsEdit(!isEdit)}
                        className={`${isEdit ? "w-[40%] lg:w-[30%]" : "w-full"} lg:w-[30%]`}
                      >
                        {isEdit ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                    </fieldset>
                    </form>
                    </Form>
                </CardContent>
            </Card>

        </main>
    )

}
