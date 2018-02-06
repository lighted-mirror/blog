import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Our web site will open.</p>
    <p>the following is some test page of post.</p>
    <h2>Peace!!</h2>
    <Link to="/blog/test-post">Go to test post</Link>
    <br/>
    <Link to="/about-us">About Us</Link>
  </div>
)

export default IndexPage
