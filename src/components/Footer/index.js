import React from 'react'
import Link from 'gatsby-link'
import './style.less'

const Footer = ({startyear}) => {
  return (
    <footer className="footer">
      <p>
        All Content Copyright © {startyear}-2018 <Link to="/blog/about-us">Lighted mirror</Link>
      </p>
      <p>
        Powered by <a href="https://www.gatsbyjs.org/" target="_blank">Gatsby</a>
      </p>
    </footer>
  )
}

export default Footer
