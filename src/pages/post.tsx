import Head from 'next/head'

export default function Post() {
  return (
    <div className="container">
      <Head>
        <title>New Post - SIXPENCE</title>
      </Head>

      <main>
        <h1>Add a purchase/place to recommend</h1>
        <form>
          <input type="text" placeholder="Pick the location" />
          <textarea placeholder="Add a note" />
          <button type="button">Add Photos</button>
          <button type="submit">Post</button>
        </form>
      </main>
    </div>
  )
}