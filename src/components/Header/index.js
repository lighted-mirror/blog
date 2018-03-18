import React from 'react'
import Link from 'gatsby-link'

import './index.less'

const Header = () => (
  <header>
    <div
      style={{
        margin: '0 auto',
        maxWidth: 800,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link to="/" className="logo-text">Lighted mirror</Link>
      </h1>
    </div>
  </header>
)

export default Header
