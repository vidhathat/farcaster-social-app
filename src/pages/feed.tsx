import Head from 'next/head'
import FeedItem from '../components/FeedItem'

export default function Feed() {
  return (
    <div className="container">
      <Head>
        <title>Feed - SIXPENCE</title>
      </Head>

      <main>
        <h1>Feed</h1>
        <FeedItem />
        {/* Add more FeedItems as needed */}
      </main>
    </div>
  )
}
