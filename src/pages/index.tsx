import Head from 'next/head'
import { SignInButton } from '@farcaster/auth-kit';
import Link from 'next/link'

export default function Home() {
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
            Discover what your Farcaster friends are buying & get rewarded for sharing it.
          </p>
            <SignInButton
                  onSuccess={({ fid, username }) =>
                    console.log(`Hello, ${username}! Your fid is ${fid}.`)
                  }
             />
        </div>
      </main>
    </div>
  )
}
