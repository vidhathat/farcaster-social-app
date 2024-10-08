import Head from 'next/head'
import FeedItem from '../components/FeedItem'
import BottomSlider from '../components/BottomSlider'
import { useProfile, UseSignInData } from '@farcaster/auth-kit'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Feed() {

  const router = useRouter()
  const { profile } = useProfile()
  const [localProfile, setLocalProfile] = useState<UseSignInData | null>(null)
  const [isSliderOpen, setIsSliderOpen] = useState(false)

  useEffect(() => {
    const profile = localStorage.getItem('profile')
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      if (parsedProfile.fid) {
        setLocalProfile(parsedProfile);
      } else {
        setLocalProfile(null)
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [])

  const handleCreatePost = () => {
    setIsSliderOpen(true)
  }

  const handlePost = (location: string, note: string, description: string) => {
    // Handle the post creation logic here
    console.log('New post:', { location, note, description })
    // You might want to add this new post to your feed or send it to a server
  }

  return (
    <div className="container">
      <Head>
        <title>Feed - SIXPENCE</title>
      </Head>

      <main className='bg-[#181A1D] p-4 relative'>
        <div className='flex justify-between items-center'>
          <img src="/logo.png" alt="SIXPENCE" className=" w-28 h-6 mb-4" />
          <img src={profile?.pfpUrl ? profile?.pfpUrl : localProfile?.pfpUrl ? localProfile?.pfpUrl : '/profile.png'} alt="Feed" className="w-8 h-8 rounded-full mb-4" />
        </div>
        <div className='flex flex-col gap-4'>
        </div>
        <FeedItem />
        <FeedItem />
        <button
          onClick={handleCreatePost}
          className='fixed bottom-10 right-10 mx-auto w-14 h-14 bg-[#FF8181] text-black text-3xl shadow-xl rounded-full flex items-center justify-center'
        >
          +
        </button>
        <BottomSlider
          isOpen={isSliderOpen}
          onClose={() => setIsSliderOpen(false)}
          onPost={handlePost}
        />
      </main>
    </div>
  )
}
