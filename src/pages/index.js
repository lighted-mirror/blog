import React from 'react';
import Link from 'gatsby-link';
import { List, Button, Icon } from 'antd';
import './index.less';
const ButtonGroup = Button.Group;

const IndexPage = ({ data: { allMarkdownRemark: { edges } } }) => {
  const Posts = edges.filter(edge => !!edge.node.frontmatter.date);
    // .map(edge => <PostLink key={edge.node.id} post={edge.node} />);
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={Posts}
        renderItem={item => {
          const { path, title, dsct, author } = item.node.frontmatter;
          return (
            <List.Item>
              <List.Item.Meta
                title={<Link to={path}>{title}</Link>}
                description={dsct || item.node.excerpt}
              />
              <div className="author-info">Posted by {author}</div>
            </List.Item>
          )
        }}
      />
      <div className="pagination">
        <ButtonGroup style={{float: 'right'}}>
          <Button type="primary">
            <Icon type="left" />Newer Posts
          </Button>
          <Button type="primary">
            Older Posts<Icon type="right" />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 100)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
            author
            dsct
          }
        }
      }
    }
  }
`;