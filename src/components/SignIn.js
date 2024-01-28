import React, { useState,useContext, useEffect } from 'react';
import { UserContext } from "../App";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import setCrashes from '../SetCrashes';
import { CrashType } from '../setCrashContext';
const LoginPage = () => {
    const { user, setUser } = useContext(UserContext);
    const {crashes, setCrashRecord} = useContext(CrashType);
    const [publicKey, setPublicKey] = useState("");
    const [passphrase, setPassphrase] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Track whether the password is visible
    const [loading,setLoading] = useState(false);
    const notifyMessage = (message,success=false) => {
        if (!success){
        toast.error(message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 650
        });
        
      }
      else{
        toast.success(message,{
          position: toast.POSITION.TOP_CENTER,
          autoClose: 650
        })
      }
    }
    useEffect(()=>{
        console.log("Loading: ",loading);
    },[loading]);
    
      function loginToApp(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        setLoading(!loading);
        if (publicKey !== "" && passphrase !== "") {
          console.log("Started");
      
          // Create an Axios instance with custom configuration
          const axiosInstance = axios.create({
            baseURL: "http://54.242.124.42:8080/api/auth/",
          });
      
          async function auth() {
            try {
              const response = await axiosInstance.post("", {
                public_key: publicKey,
                passphrase: passphrase,
              },);
      
              if (response.status !== 200) {
                notifyMessage("Incorrect username or password",false);
              }
      
              const data = response.data;
              console.log("Login Response data:",data);
              if (data) {
                const res_set_crashes= await setCrashes();
                console.log("Result from setCrashes:",res_set_crashes);
                console.log("Original crashes:",crashes);
                setCrashRecord(res_set_crashes);
                console.log("Final value of crashes:",crashes);
                setUser({ public_key: publicKey, passphrase: passphrase });
                notifyMessage("Success",true);
              } else {
                console.log("User not found");
                notifyMessage("User not found",false);
                setLoading(false);
              }
              // Handle the response data as needed
            } catch (error) {
              console.error("Error fetching data:", error);
              notifyMessage(error.message,false);
              setLoading(false);
            }
          }
          auth();
        } else {
          console.log("Fields are empty");
          notifyMessage("Fields are empty",false);
          setLoading(false);
        }
        setLoading(!loading);
      }
      
    
  const backgroundImage = require("../assets/final_bg.png")

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
        <ToastContainer />
      <div className="bg-white bg-transparent backdrop-blur-sm p-8 z-50 rounded-2xl" style={{
background: "rgba(255, 255, 255, 0.45)",
boxShadow: "0 4px 30px rgba(0, 0, 0, 0.4)",
backdropFilter: "blur(1.3px)",
WebkitBackdropFilter: "blur(1.3px)",
border: "1px solid rgba(255, 255, 255, 0.29)"}}>
      <div className="flex flex-col justify-center items-center max-w-screen-xl mx-auto h-full">
        <div className="pb-5 mb-10 pl-0">
          <p className="text-3xl text-white font-bold inline">Zenith</p>
        </div>
        <div className="flex items-center justify-center w-full">
          <form className="flex flex-col gap-16 w-full" onSubmit={loginToApp}>
            <input
              type="text"
              value={publicKey}
              name="public_key"
              placeholder="Public Key"
              onChange={(e) => setPublicKey(e.target.value)}
              className="p-2 bg-transparent border-2 border-purple-900 rounded-md text-xl focus:outline-none focus:border-2 focus:border-purple-900"
            />
            <div className=" text-left w-full relative bg-transparent rounded-md">
              <input
                type={showPassword ? "text" : "password"}
                value={passphrase}
                name="passphrase"
                placeholder="Passphrase"
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-transparent border-2 border-purple-900 rounded-md text-xl focus:border-2 focus:border-purple-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=" absolute top-3 right-4 z-10"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {!loading ? (<button className="text-white bg-purple-900 px-10 py-3 my-2 mx-auto flex text-xl items-center rounded-3xl z-20 shadow-lg shadow-violet-400">
              Login
            </button>):
            (<button className="text-white bg-purple-900 px-10 py-3 my-8 mx-auto flex text-xl items-center rounded-3xl disabled cursor-not-allowed z-20 shadow-lg shadow-violet-400">
              Loading ...
            </button>)}
          </form>
        </div>
      </div>
      </div>
      </div>
  );
};

export default LoginPage;
