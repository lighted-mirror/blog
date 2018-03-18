import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Footer from '../components/Footer'
import Header from '../components/Header'
import './index.less'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="lighted-mirror"
      meta={[
        { name: 'description', content: 'lighted-mirror' },
      ]}
    />
    <Header/>
    <div className="main-container">
      {children()}
    </div>
    <Footer/>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
