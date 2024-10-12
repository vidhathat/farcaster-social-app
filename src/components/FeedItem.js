import React from 'react'
import Image from 'next/image'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid'

const FeedItem = ({ post }) => {

  console.log(post)

  return (
    <div className="bg-[#1B1F24]  shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <Image
          src={post.profilePicUrl || '/user.png'}
          alt={post.username || 'User'}
          width={40}
          height={40}
          className="rounded-full mr-2"
        />
       <div className='flex flex-col items-start justify-center'>
          <span className="font-semibold text-gray-800 dark:text-white">{post.username || 'Anonymous'}</span>
          <span className="text-xs mb-2 text-gray-900 dark:text-white">{post.location}</span>
        </div>
      </div>
      {post.photo_url && (
        <div className="relative w-full h-48 mb-2">
          <Image src={post.photo_url} alt={post.location} layout="fill" objectFit="cover" className="rounded" />
        </div>
      )}
      <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-500 hover:text-green-500">
            <ArrowUpIcon className="h-5 w-5 mr-1" />
            <span>{post.upvotes || 0}</span>
          </button>
          <button className="flex items-center text-gray-500 hover:text-red-500">
            <ArrowDownIcon className="h-5 w-5 mr-1" />
            <span>{post.downvotes || 0}</span>
          </button>
        </div>
        <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

export default FeedItem
