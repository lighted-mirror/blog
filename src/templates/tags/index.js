import React from 'react';
import PropTypes from 'prop-types';
import { List, Divider } from 'antd';
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import { differenceBy, get } from 'lodash';
import TweenOne from 'rc-tween-one';

const Tags = ({ pathContext, data }) => {
  const { tag } = pathContext;
  let { allMarkdownRemark, authorsPosts } = data;
  let allEdges = get(allMarkdownRemark, 'edges', []);
  let authorsEdges = get(authorsPosts, 'edges', []);
  authorsEdges = differenceBy(authorsEdges, allEdges, val => {val.node.id});
  allEdges = allEdges.concat(authorsEdges);
  const Posts = allEdges.filter(edge => !!edge.node.frontmatter.date);
  return (
    <div>
      <Helmet title={`${tag} - Lighted mirror`} />
      <Divider>
        <TweenOne
          animation={{
            scale: 1,
            repeat: 1,
            yoyo: true,
            type: 'from',
            delay: 150,
            duration: 250
          }}
          style={{ transform: 'scale(1.2)' }}>
          Tag / {tag}
        </TweenOne>
      </Divider>
      <div className="home-container">
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
      </div>
    </div>
  );
};

Tags.propTypes = {
  pathContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
    authorsPosts: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
};

export default Tags;

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
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
    authorsPosts: allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { author: { eq: $tag } } }
    ) {
      totalCount
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