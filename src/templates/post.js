import React from 'react';

const styles = {
  title: {
    fontSize: 40,
    fontWeight: 700,
  },
  date: {
    color: '#6d6d6d',
    fontSize: 14,
  }
}

export default function Template({
  data,
}) {
  const { markdownRemark } = data; // data.markdownRemark 持有推文的完整信息
  const { frontmatter, html } = markdownRemark;
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1 style={styles.title}>{frontmatter.title}</h1>
        <p style={styles.date}>
          {frontmatter.date} by <a href={frontmatter.author[1]}>{`${frontmatter.author[0]}`}</a>
        </p>
        <p>
          {frontmatter.tags.map((val, i) => <span key={i}>{val}</span>)}
        </p>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath {
    markdownRemark {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        author
        tags
      }
    }
  }
`;