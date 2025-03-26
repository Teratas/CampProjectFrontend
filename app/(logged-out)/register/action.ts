"use server";

import axios from "axios";

interface sendRegisterInterface {
  email: string;
  password: string;
  confirmPassword: string;
  tel: string;
  role: string;
  name: string;
}
export const handleSubmit = async (sendData: sendRegisterInterface) => {
  try {
    const apiUrl = `http://localhost:5000/api/v1/auth/register`;
    const { confirmPassword, ...toSendData } = sendData;
    const response = await axios.post(apiUrl, toSendData);
    // console.log('responseRegister', response)
    if (!response) {
      return {
        success: false,
        message: "Failed",
      };
    }
    return response.data;
  } catch (err: any) {
    console.error("Registration error");
    return {
      success: false,
      message: err.response?.data ?? "Failed to Register",
    };
  }
};
