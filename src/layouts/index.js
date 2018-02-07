import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Footer from '../components/Footer'
import './index.less'

const TemplateWrapper = ({ children, data }) => {
  const { site: { siteMetadata } } = data;
  return (
    <div>
      <Helmet
        title="Lighted Mirror"
        meta={[
          { name: 'description', content: 'Lighted Mirror \'s site' },
          { name: 'keywords', content: 'blog, Lighted Mirror' },
        ]}
      />
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
      <Footer startyear={siteMetadata.startyear}/>
    </div>
  )
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper

export const pageQuery = graphql`
  query siteConfig {
  site {
    siteMetadata {
      startyear
    }
  }
}`;
