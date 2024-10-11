import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

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

type FeedItemProps = {
  post: Post;
  onVote: (voteType: 'upvote' | 'downvote') => void;
};

const FeedItem: React.FC<FeedItemProps> = ({ post, onVote }) => {
  const handleVote = (voteType: 'upvote' | 'downvote') => {
    console.log(`Vote button clicked in FeedItem: ${voteType} for post ${post.id}`);
    try {
      onVote(voteType);
    } catch (error) {
      console.error('Error in FeedItem handleVote:', error);
    }
  };

  return (
    <div className="bg-[#242424] rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <img src={post.profilePicUrl} alt={post.username} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="font-bold text-white">{post.username}</h3>
          <p className="text-gray-400 text-sm">{post.location}</p>
        </div>
      </div>
      <p className="text-white mb-2">{post.description}</p>
      {post.photo_url && (
        <img src={post.photo_url} alt="Post" className="w-full rounded-lg mb-2" />
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => {
              console.log('Upvote button clicked');
              handleVote('upvote');
            }}
            className={`mr-2 p-1 rounded ${post.userVote === 'upvote' ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            <FaThumbsUp className="text-white" />
          </button>
          <span className="text-white mr-4">{post.upvotes}</span>
          <button 
            onClick={() => {
              console.log('Downvote button clicked');
              handleVote('downvote');
            }}
            className={`mr-2 p-1 rounded ${post.userVote === 'downvote' ? 'bg-red-500' : 'bg-gray-700'}`}
          >
            <FaThumbsDown className="text-white" />
          </button>
          <span className="text-white">{post.downvotes}</span>
        </div>
        <span className="text-gray-400 text-sm">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default FeedItem;