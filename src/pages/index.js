import React from 'react';
import Link from 'gatsby-link'

export default class BlogIndex extends React.Component {
  render() {
    if (this.props.errors && this.props.errors.length) {
      this.props.errors.forEach(({ message }) => {
        console.error(`BlogIndex render errr: ${message}`);
      });
      return <h1>Errors found: Check the console for details</h1>;
    }
    let getUrl = parent => {
      let path = parent.split(' ')[0].split('/');
      path.shift();
      path[path.length - 1] = path[path.length - 1].split('.')[0];
      path = `/${path.join('/')}`;
      return path
    }
    return (
      <div>
        <h1>Hi people</h1>
        <p>Our web site will open.</p>
        <p>the following is some test page of post.</p>
        <h2>Peace!!</h2>
        <ul>
          {
            this.props.data.allMarkdownRemark.edges.map(({ node }, i) => (
              <li key={i}><Link to={getUrl(node.frontmatter.parent)}>{node.frontmatter.title}</Link></li>
            ))
          }
          <li><Link to="/about-us">About Us</Link></li>
        </ul>
      </div>
    );
  }
}

export const pageQuery = graphql`
  query hehe {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            parent
          }
        }
      }
    }
  }
`;