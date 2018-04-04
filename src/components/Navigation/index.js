import React, { Component } from 'react'
import Link from 'gatsby-link'
import { Parallax, OverPack } from 'rc-scroll-anim';
import TweenOne from 'rc-tween-one';
import { Icon } from 'antd';

import './index.less'

class  Navigation extends Component {
  render () {
    return (
      <div
        className="navigation-bar">
        <TweenOne
          className="tools"
          key="0"
          animation={{ scale: 1, opacity: 1, duration: 200}}
          style={{ transform: 'scale(0.94)', opacity: '0' }}>
          <span>
            <Link to="/"><Icon type="home" /></Link>
            <Link to="/tags"><Icon type="tags-o" /></Link>
            <Link to="/seting"><Icon type="api" /></Link>
          </span>
        </TweenOne>
      </div>
    )
  }
}

export default Navigation
