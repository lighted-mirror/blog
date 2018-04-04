import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Affix } from 'antd';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import ThemeProvider from '../theme/ThemeProvider.js';
import './index.less';

class TemplateWrapper extends Component {

  state = {
    showNavigationBar: false,
    lock: true,
    style: {
      top: -80
    }
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      window.document.addEventListener('scroll', this.handleScroll);
      window.document.addEventListener('mousewheel', this.handleMousewheel);
    }
  }

  handleScroll = () => {
    let { lock } = this.state;
    // 滚动条位于顶部
    if (window.scrollY == 0 && this.state.lock == true) {
      setTimeout(() => {
        // 是否依旧位于顶部
        if (window.scrollY == 0) {
          this.setState({lock: false})
        }
      }, 300);
    } else {
      // 是否已经上锁
      if (!lock) {
        this.setState({lock: true});
      }
    }
  }

  handleShowNavigationBar = () => {
    this.setState({
      showNavigationBar: !this.state.showNavigationBar,
      style: {
        top: this.state.showNavigationBar ? -80 : 0
      }
    });
  }

  handleMousewheel = e => {
    let top = e.wheelDelta;
    let { lock } = this.state;
    // 是否存在滚动条向上趋势
    if (e.wheelDelta > 0) {
      // 未上锁
      if (!lock) {
        // 滚动距离 在鼠标上滚动一格为 120 触摸板 足够精确
        if (top > 480) {
          this.setState({style: {top: 0}, lock: true});
        }
      }
    } else {
      this.setState({style: {top: -80}});
    }
  }

  switchTheme = theme => {
    console.log(theme);
  }

  render () {
    return (
      <ThemeProvider theme="dark">
        <Helmet
          title="lighted-mirror"
          meta={[{ name: 'description', content: 'lighted-mirror' }]}
        />
        <Header/>
        <Navigation showNavigationBar={this.state.showNavigationBar}/>
        <div className="main-container" style={this.state.style}>
          <Affix>
            <button className="bar" onClick={this.handleShowNavigationBar}></button>
          </Affix>
          <div className="content-container">
            { this.props.children() }
          </div>
        </div>
        <Footer/>
      </ThemeProvider>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
