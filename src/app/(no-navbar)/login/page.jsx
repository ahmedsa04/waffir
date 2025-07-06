"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import waffirBG from "../../../../public/waffirBG.svg";
import Image from "next/image";
import waffirLogo from "../../../../public/waffir-glyph-knockout.svg";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [errorMessage, setError] = useState(null);
  const supabase = createClientComponentClient();
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username + "@gmail.com",
      password: password,
    });

    if (error) {
      setError(error);
    }
    router.push("/"); // or router.push('/') to trigger re-run of middleware
  };

  return (
    <div
      style={{
        backgroundImage: `url(${waffirBG.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=" w-full h-screen"
    >
      <div className=" w-full h-full flex justify-center items-center">
        <div className=" -mt-16">
          <Image alt="" src={waffirLogo} className="w-44 h-44 mx-auto" />
          <h1 className=" text-4xl font-bold text-white text-center mt-8 mb-12">
            Login
          </h1>
          <form className=" grid grid-rows-2 gap-y-4" onSubmit={handleLogin}>
            <div className=" grid grid-rows-2 w-fit h-fit">
              <label className=" h-fit p-1 px-2 !bg-transparent text-xl font-semibold text-white">
                Username
              </label>
              <input
                className=" w-72 h-fit p-1 px-2 !bg-transparent focus:outline-0 focus:bg-transparent border-b rounded-lg border-white text-xl font-medium text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
              />
            </div>
            <div className=" grid grid-rows-2 w-fit h-fit">
              <label className=" h-fit p-1 px-2 !bg-transparent text-xl font-semibold text-white">
                Password
              </label>
              <input
                className=" w-72 h-fit p-1 px-2 !bg-transparent focus:outline-0 focus:bg-transparent border-b rounded-lg border-white text-xl font-medium text-white"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
              />
            </div>
            <button
              onClick={(e) => handleLogin(e)}
              className=" w-fit my-6 mx-auto border rounded-2xl text-2xl  p-1 px-2 font-bold hover:cursor-pointer text-white"
              type="submit"
            >
              Login
            </button>
            {errorMessage && <p>{errorMessage.message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
