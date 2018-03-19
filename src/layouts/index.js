import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { Icon, Affix } from 'antd';

import Footer from '../components/Footer'
import Header from '../components/Header'
import './index.less'

class TemplateWrapper extends Component {

  state = {
    showNavigationBar: false,
  }

  handleShowNavigationBar = () => {
    this.setState({showNavigationBar: !this.state.showNavigationBar});
  }

  render () {
    return (
      <div>
        <Helmet
          title="lighted-mirror"
          meta={[
            { name: 'description', content: 'lighted-mirror' },
          ]}
        />
        <Header/>
        <div className="navigation-bar">
          <Affix offsetTop={-30}>
            <div className="tools" style={{top: this.state.handleShowNavigationBar ? 30 : -30}}>
              <span><Icon type="arrow-left" /> Home</span>
            </div>
          </Affix>
        </div>
        <div className="navigation-btn" style={{top: this.state.showNavigationBar ? 0 : -60}}>
          <Affix>
            <button className="bar" onClick={this.handleShowNavigationBar}></button>
          </Affix>
          <div className="main-container">
            {this.props.children()}
          </div>
        </div>

        <Footer/>
      </div>
    )
  }
}


// const TemplateWrapper = ({ children }) => (
//   <div>
//     <Helmet
//       title="lighted-mirror"
//       meta={[
//         { name: 'description', content: 'lighted-mirror' },
//       ]}
//     />
//     <Header/>
//     <div className="navigation-bar">
//       <Affix offsetTop={-30}>
//         <div className="tools">
//           <span><Icon type="arrow-left" /> Home</span>
//         </div>
//       </Affix>
//       <Affix>
//         <button className="bar" onClick={}></button>
//       </Affix>
//     </div>
//     <div className="main-container">
//       {children()}
//     </div>
//     <Footer/>
//   </div>
// )

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
