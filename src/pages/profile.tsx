import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useRouter } from 'next/router'

type Post = {
  id: number
  location: string
  description: string
  created_at: string
  fid: number
  photo_url: string
  username: string
  profilePicUrl: string
}

type UserProfile = {
  fid: number
  username: string
  photoUrl: string
  address: string
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])

  const router = useRouter()

  useEffect(() => {
    const storedProfile = localStorage.getItem('user')
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      setUserProfile(parsedProfile)
      fetchUserPosts(parsedProfile.fid)
    } else {
      localStorage.clear()
      router.push('/')
    }
  }, [])

  const fetchUserPosts = async (fid: number) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('fid', fid)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user posts:', error)
    } else {
      setUserPosts(data)
    }
  }

  if (!userProfile) {
    return <div className="min-h-screen bg-[#181A1D] flex justify-center items-center">
      <p className="text-white">Loading...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-[#181A1D] flex justify-center p-4">
      <Head>
        <title>Profile - ShareSpot</title>
      </Head>

      <div className="w-full max-w-md">
        <Link href="/feed" className="text-white mb-4 block">&larr; Back to Feed</Link>
        
        <div className="rounded-lg p-6 mb-6 flex items-center">
          <img src={userProfile.photoUrl || '/profile.png'} alt="Profile" className="w-24 h-24 rounded-full mr-6" />
          <div>
            <h1 className="text-2xl font-bold text-white">{userProfile.username || 'User'}</h1>
            <p className="text-gray-400">@{userProfile.username || 'username'}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4">My Posts</h2>
        
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {userPosts.map((post) => (
              <div key={post.id} className="bg-[#242424] rounded-lg overflow-hidden">
                {post.photo_url && (
                  <img src={post.photo_url} alt="Post" className="w-full h-32 object-cover" />
                )}
                <div className="p-2">
                  <p className="text-white text-sm mb-1 line-clamp-2">{post.description}</p>
                  <div className="flex items-center text-gray-400 text-xs">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{post.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white text-center">No posts created yet.</p>
        )}
      </div>
    </div>
  )
}