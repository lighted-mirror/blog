import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Header from '../components/Header'
import './index.css'
import './syntax.css'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Lighted Mirror"
      meta={[
        { name: 'description', content: 'Lighted Mirror \'s site'},
        { name: 'keywords', content: 'blog, Lighted Mirror' },
      ]}
    />
    <Header />
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      {children()}
    </div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
