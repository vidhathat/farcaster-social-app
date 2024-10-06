import Head from 'next/head'
import ProfilePost from '../components/ProfilePost'

export default function Profile() {
  return (
    <div className="container">
      <Head>
        <title>Profile - SIXPENCE</title>
      </Head>

      <main>
        <h1>Akhil</h1>
        <p>@akhil_bvs</p>
        <p>designer, product builder |player / fbi | fid #1265</p>
        <div className="posts-grid">
          <ProfilePost />
          {/* Add more ProfilePosts as needed */}
        </div>
      </main>
    </div>
  )
}