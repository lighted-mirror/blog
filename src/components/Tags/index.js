import React from 'react';
import Link from "gatsby-link";
import './index.less';
import kebabCase from "lodash/kebabCase";

const Tags = ({tags}) => (
  <div className="tags">
    {
      tags
      ? tags.map((tag, i) => {
        return (
          <Link to={`/tags/${kebabCase(tag)}`} key={`tag${i}`} className="tag">
            <span>{tag}</span>
          </Link>
        )
      })
      : null
    }
  </div>
);

export default Tags;
