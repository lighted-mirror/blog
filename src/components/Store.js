import React, { Components } from 'react';

class Store extends Components {
  state = {
    theme: 'red'
  }

  componentWillReceiveProps(next) {
    const { theme, onThemeChange } = this.props;
    if (theme !== next.theme && onThemeChange) {
      onThemeChange(next.theme);
    }
  }
}

export default Store;