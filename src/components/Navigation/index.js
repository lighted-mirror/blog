import React, { Component } from 'react'
import Link from 'gatsby-link'
import { Parallax, OverPack } from 'rc-scroll-anim';
import TweenOne from 'rc-tween-one';
import { Icon, Popover } from 'antd';

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
            <Popover placement="top" content="主页">
              <Link to="/"><Icon type="home" /></Link>
            </Popover>
            <Popover placement="top" content="标签">
              <Link to="/tags"><Icon type="tags-o" /></Link>
            </Popover>
            <Popover placement="top" content="关于我们">
              <Link to="/about-us"><Icon type="contacts" /></Link>
            </Popover>
            <Popover placement="top" content="作品">
              <Link to="/seting"><Icon type="paper-clip" /></Link>
            </Popover>
            <Link to="/seting"><Icon type="api" /></Link>
          </span>
        </TweenOne>
      </div>
    )
  }
}

export default Navigation
