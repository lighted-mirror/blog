import React from 'react';
import { Divider } from 'antd';
import './index.less';

// 作者信息
const Author = ({author}) => {
  if (Array.isArray(author)) {
    return author.map(val => {
      return <span>{val}</span>
    })
  } else {
    return <span>{author}</span>
  }
}

const Info = ({date, author}) => (
  <Divider dashed>
    <h2 className="post-date">{date} <Divider type="vertical" /> by <Author author={author}/></h2>
  </Divider>
);

export default Info;
