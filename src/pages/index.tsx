import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>SIXPENCE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>SIXPENCE</h1>
        <p>Discover what your Farcaster friends are buying & get rewarded for sharing it.</p>
        <button>Connect Farcaster</button>
      </main>
    </div>
  )
}
