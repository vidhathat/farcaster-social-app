import Head from "next/head";
import { SignInButton, UseSignInData } from "@farcaster/auth-kit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();

  const handleLogin = async (profile: UseSignInData) => {
    try {
      console.log(profile)
      if (profile?.fid) {
        const userProfile = {
          fid: profile.fid,
          username: profile.username,
          photoUrl: profile.pfpUrl,
          address: profile.verifications?.[0] || null
        };

        // Insert or update user profile in Supabase
        const { data, error } = await supabase
          .from('users')
          .upsert(userProfile, { onConflict: 'fid' })
          .select()
          .single();

        if (error) throw error;

        // Store only the fid in localStorage for quick checks
        localStorage.setItem('fid', profile.fid.toString());
        localStorage.setItem('user', JSON.stringify(userProfile));
        // set all userprofile in localStorage
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        router.push("/feed");
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  }

  useEffect(() => {
    const fid = localStorage.getItem('fid');
    if (fid) {
      router.push("/feed");
    } else {
      console.log("No fid found")
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Head>
        <title>ShareSpot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container bg-[#181A1D] mx-auto max-w-md w-full flex-grow flex flex-col relative">
        <div className="w-full">
          <img src="/login.png" alt="ShareSpot" className="w-full  mx-auto" />
        </div>
        <div className="absolute top-[65%] md:top-[70%] bottom-0 left-0 right-0 bg-[#181A1D] rounded-t-[40px] flex flex-col justify-center items-center p-6">
          <h1 className="text-3xl font-bold mb-4 text-white">ShareSpot</h1>
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
