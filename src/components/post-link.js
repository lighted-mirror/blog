import React from 'react';
import Link from 'gatsby-link';
import { Divider } from 'antd';

const PostLink = ({ post }) => (
  <div>
    <Divider orientation="left" dashed>
      <Link to={post.frontmatter.path}>
        {post.frontmatter.title}
      </Link>
    </Divider>

  </div>
);

export default PostLink;