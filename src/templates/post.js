import React from 'react';
import { Divider, BackTop } from 'antd';
import Helmet from 'react-helmet';
import './post.less';
import './prism.less';

export default function Template({
  data, // 这个 prop 将被下面的 GraphQL 查询注入。
}) {
  const { markdownRemark } = data; // data.markdownRemark 将持有我们文章的完整信息
  const { frontmatter, html } = markdownRemark;
  return (
    <div className="blog-post-container">
      <Helmet title={`${frontmatter.title} - Lighted mirror`}/>
      <div className="blog-post">
        <h1 className="post-title">{frontmatter.title}</h1>
        <Divider dashed>
          <h2 className="post-date">{frontmatter.date} <Divider type="vertical" /> by {frontmatter.author}</h2>
        </Divider>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {/* 返回顶部 */}
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
      }
    }
  }
`;