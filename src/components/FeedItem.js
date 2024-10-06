export default function FeedItem() {
    return (
      <div className="feed-item">
        <div className="user-info">
          <img src="/avatar.jpg" alt="User avatar" />
          <span>Dan @dwr</span>
          <span>3hr</span>
        </div>
        <p>Bought tickets to Ed Sheeran's concert on bookmyshow.</p>
        <img src="/concert-image.jpg" alt="Concert" />
        <p>📍 Location Map Link</p>
        <div className="actions">
          <button>Upvote</button>
          <button>Downvote</button>
          <button>Share</button>
        </div>
      </div>
    )
  }
  