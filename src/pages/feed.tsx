import Head from 'next/head'
import Link from 'next/link'
import FeedItem from '../components/FeedItem'
import BottomSlider from '../components/BottomSlider'
import { useProfile } from '@farcaster/auth-kit'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Post = {
  id: number
  location: string
  description: string
  created_at: string
  fid: number
  photo_url: string
  username: string
  profilePicUrl: string
  upvotes: number
  downvotes: number
  userVote: 'upvote' | 'downvote' | null
}

type UserProfile = {
  fid: number
  username: string
  photoUrl: string
  address: string
}

export default function Feed() {
  const router = useRouter()
  const { profile } = useProfile()
  const [isSliderOpen, setIsSliderOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      setUserProfile(parsedProfile)
      fetchPosts(parsedProfile.fid)
    } else {
      router.push('/')
    }
  }, [])

  const fetchPosts = async (fid: number) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        votes (upvote, downvote, user_fid)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      const postsWithVotes = data.map(post => {
        const votes = post.votes || []
        const upvotes = votes.filter((v: any) => v.upvote).length
        const downvotes = votes.filter((v: any) => v.downvote).length
        const userVote = votes.find((v: any) => v.user_fid === fid)
        return {
          ...post,
          upvotes,
          downvotes,
          userVote: userVote 
            ? (userVote.upvote ? 'upvote' : 'downvote') 
            : null
        }
      })
      setPosts(postsWithVotes)
    }
  }

  const handleCreatePost = () => {
    setIsSliderOpen(true)
  }

  const handlePost = async (location: string, description: string, photoUrl: string) => {
    if (!userProfile) {
      console.error('No user profile found')
      return
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ 
          location, 
          description, 
          fid: userProfile.fid, 
          photo_url: photoUrl, 
          username: userProfile.username, 
          profilePicUrl: userProfile.photoUrl
        }])

      if (error) {
        throw error
      }

      console.log('Post created successfully:', data)
      await fetchPosts(userProfile.fid)
      setIsSliderOpen(false) // Close the slider after successful post
      toast.success('Post created successfully') // Show success message
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Error creating post')
    }
  }

  const handleVote = async (postId: number, voteType: 'upvote' | 'downvote') => {
    console.log(`Voting ${voteType} for post ${postId}`);
    if (!userProfile) {
      console.error('No user profile found');
      return;
    }

    try {
      // Immediately update the local state
      setPosts(prevPosts => {
        const newPosts = prevPosts.map(post => {
          if (post.id === postId) {
            console.log(`Current post state:`, post);
            let newUpvotes = post.upvotes;
            let newDownvotes = post.downvotes;

            if (post.userVote === voteType) {
              // If clicking the same vote type, remove the vote
              newUpvotes = voteType === 'upvote' ? newUpvotes - 1 : newUpvotes;
              newDownvotes = voteType === 'downvote' ? newDownvotes - 1 : newDownvotes;
            } else {
              // If changing vote or voting for the first time
              if (post.userVote) {
                // Remove the old vote
                newUpvotes = post.userVote === 'upvote' ? newUpvotes - 1 : newUpvotes;
                newDownvotes = post.userVote === 'downvote' ? newDownvotes - 1 : newDownvotes;
              }
              // Add the new vote
              newUpvotes = voteType === 'upvote' ? newUpvotes + 1 : newUpvotes;
              newDownvotes = voteType === 'downvote' ? newDownvotes + 1 : newDownvotes;
            }

            const newPost = {
              ...post,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVote: post.userVote === voteType ? null : voteType
            };
            console.log(`New post state:`, newPost);
            return newPost;
          }
          return post;
        });
        console.log('New posts state:', newPosts);
        return newPosts;
      });

      console.log(`Fetching existing vote for post ${postId}`);
      const { data: existingVote, error: fetchError } = await supabase
        .from('votes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_fid', userProfile.fid)
        .single();

      console.log(`Existing vote:`, existingVote);

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingVote) {
        if (existingVote.upvote === (voteType === 'upvote') && existingVote.downvote === (voteType === 'downvote')) {
          console.log(`Removing vote for post ${postId}`);
          // Remove the vote if it's the same type
          await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          console.log(`Updating vote for post ${postId}`);
          // Update the vote type if it's different
          await supabase
            .from('votes')
            .update({ 
              upvote: voteType === 'upvote', 
              downvote: voteType === 'downvote' 
            })
            .eq('id', existingVote.id);
        }
      } else {
        console.log(`Inserting new vote for post ${postId}`);
        // Insert a new vote
        await supabase
          .from('votes')
          .insert({ 
            post_id: postId, 
            user_fid: userProfile.fid, 
            creator_id: posts.find(p => p.id === postId)?.fid,
            upvote: voteType === 'upvote',
            downvote: voteType === 'downvote'
          });
      }

      console.log(`Fetching updated post ${postId}`);
      // Fetch the updated post to get the correct vote counts
      const { data: updatedPost, error: updateError } = await supabase
        .from('posts')
        .select('*, votes(upvote, downvote)')
        .eq('id', postId)
        .single();

      if (updateError) throw updateError;

      console.log(`Updated post:`, updatedPost);

      // Update the local state with the correct vote counts
      setPosts(prevPosts => {
        const newPosts = prevPosts.map(post => 
          post.id === postId 
            ? {
                ...post,
                upvotes: updatedPost.votes.filter((v: any) => v.upvote).length,
                downvotes: updatedPost.votes.filter((v: any) => v.downvote).length,
                userVote: voteType
              }
            : post
        );
        console.log('Final posts state:', newPosts);
        return newPosts;
      });

      toast.success('Vote updated successfully');
    } catch (error) {
      console.error('Error handling vote:', error);
      toast.error('Error updating vote');
      // If there's an error, revert the local state change
      fetchPosts(userProfile.fid);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-0 sm:p-4">
      <Head>
        <title>Feed - SIXPENCE</title>
      </Head>

      <div className="w-full h-full sm:max-w-md bg-[#181A1D] sm:rounded-3xl sm:shadow-lg overflow-hidden">
        <div className="bg-[#181A1D] p-4 h-screen sm:h-[calc(100vh-2rem)] flex flex-col">
          <div className='flex justify-between items-center mb-4'>
            <img src="/logo.png" alt="SIXPENCE" className="w-28 h-6" />
            <Link href="/profile">
              <img src={userProfile?.photoUrl || '/profile.png'} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
            </Link>
          </div>
          <div className='flex-grow overflow-y-auto'>
            <div className='flex flex-col gap-4'>
              {posts.map((post) => (
                <FeedItem 
                  key={post.id} 
                  post={post} 
                  onVote={(voteType: 'upvote' | 'downvote') => {
                    console.log(`onVote called in Feed for post ${post.id} with voteType ${voteType}`);
                    handleVote(post.id, voteType);
                  }}
                />
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