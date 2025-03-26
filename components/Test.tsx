'use client'
import axios from "axios";
import { useEffect } from "react";

export const Test = ({accessToken} : {accessToken:string}) => {
  useEffect(() => {
    async function fetchInstagramProfile(accessToken: string) {
        console.log('Access Token:', accessToken); // Log the token to ensure it’s correct
        try {
          const response = await axios.get(
            `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${accessToken}`
          );
          console.log('Instagram Profile:', response.data);
          return response.data;
        } catch (error: any) {
          console.error("Error fetching Instagram profile:", error.response?.data || error.message);
          throw new Error("Failed to fetch Instagram profile");
        }
      }
    fetchInstagramProfile(accessToken)
  })
  return (
    <div>
      Test1
    </div>
  )
}