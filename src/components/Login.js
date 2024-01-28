import React, {  useContext, useState } from "react";
import { UserContext } from "../App";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function Login() {
  const { user, setUser } = useContext(UserContext);
  const [publicKey, setPublicKey] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Track whether the password is visible
  const [loading,setLoading] = useState(false);

  const notifyError = (message) => {
  
    toast.error(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 650
    });
    
  }
  

  function loginToApp(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(!loading);
    if (publicKey !== "" && passphrase !== "") {
      console.log("Started");
  
      // Create an Axios instance with custom configuration
      const axiosInstance = axios.create({
        baseURL: "http://54.242.124.42:8080/api/auth",
      });
  
      async function auth() {
        try {
          const response = await axiosInstance.post("", {
            public_key: publicKey,
            passphrase: passphrase,
          },);
  
          if (response.status !== 200) {
            throw new Error("Network response was not ok");
            
          }
  
          const data = response.data;
          console.log(data);
          if (data) {
            setUser({ public_key: publicKey, passphrase: passphrase });
            window.sessionStorage.setItem("user",JSON.stringify(user));
          } else {
            console.log("User not found");
            notifyError("User not found");
            setLoading(false);
          }
          // Handle the response data as needed
        } catch (error) {
          console.error("Error fetching data:", error);
          notifyError(error);
          setLoading(false);
        }
      }
      auth();
    } else {
      console.log("Fields are empty");
      notifyError("Fields are empty");
    }
    setLoading(!loading);
    console.log("Success");
  }
  

  return (
    <div className="w-full h-screen p-4">
      <ToastContainer />
      <div className="flex flex-col p-4 justify-center items-center max-w-screen-xl mx-auto h-full">
        <div className="pb-8 mb-10">
          <p className="text-3xl font-bold inline border-b-4 border-blue-500">Welcome to CrashEye</p>
        </div>
        <div className="flex items-center justify-center w-full">
          <form className="flex flex-col gap-10 w-full md:w-1/2" onSubmit={loginToApp}>
            <input
              type="text"
              value={publicKey}
              name="public_key"
              placeholder="Public Key"
              onChange={(e) => setPublicKey(e.target.value)}
              className="p-2 bg-transparent border-2 rounded-md text-xl focus:outline-none"
            />
            <div className=" text-left w-full relative bg-transparent rounded-md">
              <input
                type={showPassword ? "text" : "password"}
                value={passphrase}
                name="passphrase"
                placeholder="Passphrase"
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-transparent border-2 rounded-md text-xl focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=" absolute top-3 right-4 z-10"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {!loading ? (<button className="text-white bg-cyan-500 px-10 py-3 my-8 mx-auto flex text-xl items-center rounded-3xl">
              Login
            </button>):
            (<button className="text-white bg-cyan-500 px-10 py-3 my-8 mx-auto flex text-xl items-center rounded-3xl disabled cursor-not-allowed">
              Loading ...
            </button>)}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
