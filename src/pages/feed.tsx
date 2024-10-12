import Head from 'next/head'
import FeedItem from '../components/FeedItem'
import BottomSlider from '../components/BottomSlider'
import { useProfile } from '@farcaster/auth-kit'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define a type for our posts
type Post = {
  id: number
  location: string
  description: string
  created_at: string
  fid: number
  upvotes: number
  downvotes: number
  photo_url: string
  username: string
  profilePicUrl: string
}

type User = {
  fid: number
  username: string
  photoUrl: string
  address?: string | null
}

export default function Feed() {
  const router = useRouter()
  const { profile } = useProfile()
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fid = localStorage.getItem('fid')
    if (fid) {
      const user = localStorage.getItem('user')
      if (user) {
        setUser(JSON.parse(user))
      }
      fetchPosts(Number(fid))
    } else {
      router.push('/')
    }
  }, [])

  const fetchPosts = async (fid: number) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data)
    }
  }

  console.log('profile', profile)
  const handleCreatePost = () => {
    setIsSliderOpen(true)
  }

  const handlePost = async (location: string, description: string, photoUrl: string) => {
    const fid = profile?.fid || Number(localStorage.getItem('fid'))
    if (!fid) {
      console.error('No FID found')
      return
    }

    try {
      // Fetch user information from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username, photoUrl')
        .eq('fid', fid)
        .single()

      if (userError) {
        throw userError
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([{ 
          location, 
          description, 
          fid, 
          photo_url: photoUrl, 
          username: userData.username, 
          profilePicUrl: userData.photoUrl
        }])

      if (error) {
        throw error
      }

      console.log('Post created successfully:', data)
      await fetchPosts(fid)
      setIsSliderOpen(false) // Close the slider after successful post
      toast.success('Post created successfully') // Show success message
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Error creating post')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-0 sm:p-4">
      <Head>
        <title>Feed - SIXPENCE</title>
      </Head>

      <div className="w-full h-full sm:max-w-md bg-[#181A1D] sm:rounded-3xl sm:shadow-lg overflow-hidden">
        <div className="bg-[#181A1D] p-4 h-screen sm:h-[calc(100vh-2rem)] flex flex-col">
          <div className='flex justify-between items-center mb-4'>
            <img src="/logo.png" alt="SIXPENCE" className="w-28 h-6" />
            <img src={profile?.pfpUrl ? profile?.pfpUrl : user?.photoUrl ? user.photoUrl : '/profile.png'} alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
          <div className='flex-grow overflow-y-auto'>
            <div className='flex flex-col gap-4'>
              {posts.map((post) => (
                <FeedItem key={post.id} post={post} />
              ))}
            </div>
          </div>
          <button
            onClick={handleCreatePost}
            className='fixed bottom-6 right-1/2 transform translate-x-1/2 w-14 h-14 bg-[#FF8181] text-black text-3xl shadow-xl rounded-full flex items-center justify-center'
          >
            +
          </button>
        </div>
      </div>
      <BottomSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
        onPost={handlePost}
      />
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  )
}
