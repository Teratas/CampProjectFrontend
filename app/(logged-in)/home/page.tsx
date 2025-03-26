import { auth, signOut } from "@/auth";
import { Test } from "@/components/Test";
import CardLogin from "@/components/ui/LoginCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";


export default async function HomePage() {
  const session : any = await auth();
  const userData = session?.user
  const accessToken = session?.accessToken ?? ""

  return (
    <main className="min-h-screen flex justify-center items-center">
      <CardLogin session={session} userData={userData}/>
    </main>
  );
}
