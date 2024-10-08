import Head from "next/head";
import { SignInButton, UseSignInData } from "@farcaster/auth-kit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const handleLogin = async (profile: UseSignInData) => {
    try {
      if (profile?.fid) {
        localStorage.setItem('profile', JSON.stringify(profile))
        router.push("/feed");
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const profile = localStorage.getItem('profile')
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      if (parsedProfile?.fid) {
        router.push("/feed");
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Head>
        <title>SIXPENCE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container bg-[#181A1D] mx-auto max-w-md w-full flex-grow flex flex-col relative">
        <div className="w-full">
          <img src="/login.png" alt="SIXPENCE" className="w-full  mx-auto" />
        </div>
        <div className="absolute top-[65%] md:top-[70%] bottom-0 left-0 right-0 bg-[#181A1D] rounded-t-[40px] flex flex-col justify-center items-center p-6">
          <h1 className="text-3xl font-bold mb-4 text-white">SIXPENCE</h1>
          <p className="mb-8 text-gray-300">
            Discover what your Farcaster friends are buying & get rewarded for
            sharing it.
          </p>
          <SignInButton
            onSuccess={(profile) => handleLogin(profile)}
          />
        </div>
      </main>
    </div>
  );
}
