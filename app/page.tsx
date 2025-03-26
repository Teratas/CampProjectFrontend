'use client'
import Image from "next/image";
import axios from 'axios'
export default function Home() {
  const handleSignInViaFacebook = async () => {
    const apiUrl = `http://localhost:5000/api/v1/auth/facebook`
    const data = await axios.get(apiUrl)
    console.log('data', data)
  }
  return (
    <div className="h-[100vh] flex justify-center items-center">
      
      
    </div>
  );
}
