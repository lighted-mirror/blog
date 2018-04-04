import React from 'react';
import { Divider, BackTop } from 'antd';
import Helmet from 'react-helmet';
import Tags from '../../components/Tags';
import Info from '../../components/Info';
import './post.less';
import './prism.less';

import TweenOne from 'rc-tween-one';

export default function Template({data}) {
  const { markdownRemark } = data; // 持有我们文章的完整信息
  const { frontmatter:{title,date,author,tags}, html } = markdownRemark;
  return (
    <div className="blog-post-container">
      <Helmet title={`${title} - Lighted mirror`} />
        <TweenOne
          key={`${title}_context`}
          animation={{opacity: 1}}
          style={{ opacity: 0, position: 'relative' }}
          className="blog-post"
          >
          <h1 className="post-title">{title}</h1>
          <Info author={author} date={date} />
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <Divider dashed>
            <span className="post-date">Tags</span>
          </Divider>
          <Tags tags={tags} />
        </TweenOne>
      <BackTop />
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        author
        dsct
        tags
      }
    }
  }
`;