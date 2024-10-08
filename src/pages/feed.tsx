import Head from 'next/head'
import FeedItem from '../components/FeedItem'

export default function Feed() {
  return (
    <div className="container">
      <Head>
        <title>Feed - SIXPENCE</title>
      </Head>

      <main className='bg-[#181A1D] p-4'>
        <div className='flex justify-between items-center'>
          <img src="/logo.png" alt="SIXPENCE" className=" w-28 h-6 mb-4" />
          <img src="/profile.png" alt="Feed" className="w-8 h-8 rounded-full mb-4" />
        </div>
        <FeedItem />
        <FeedItem />
      </main>
    </div>
  )
}
