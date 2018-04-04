import React, { Component } from 'react';

// 主题色
import './red.less';
import './blue.less';
import './magenta.less';
import './dark.less';

class ThemeProvider extends Component {

  render () {
    return (
      <div className={`${this.props.theme}-body`} id="body">
        { this.props.children }
      </div>
    )
  }
}

export default ThemeProvider
