import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import TweenOne from 'rc-tween-one';
// Utilities
import kebabCase from 'lodash/kebabCase';

// Components
import Helmet from 'react-helmet';
import Link from 'gatsby-link';
import './tags.less';

// 生成每一个标签的动效（随机延时时间）
const getTagAnimation = () => ({
  scale: 1,
  delay: Math.floor(Math.random()*40)*10
});


class TagsPage extends Component {
  state = {
    value: '',
  }

  handleChange = val => {
    this.setState({value: val.target.value.toUpperCase()})
  }

  render () {
    const { data: { allMarkdownRemark: { tags, authors }, site: { siteMetadata: { title } } } } = this.props;
    return (
      <div className="page-tags">
        <Helmet title={'tags - Lighted mirror'} />
        <span>{this.state.value}</span>
        <Input placeholder="Basic usage" value={this.state.value} onChange={this.handleChange}/>
        <ul>
          {authors.map(tag => (
            <TweenOne
              component="li"
              animation={getTagAnimation()}
              key={tag.fieldValue}
              style={{transform: 'scale(0)'}}
              className="tag-box-author">
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                <span className="author tag-name">{tag.fieldValue}</span>
                <span className="author post-num">{tag.totalCount}</span>
              </Link>
            </TweenOne>
          ))}

          {tags.map(tag => (
            <TweenOne
              component="li"
              animation={getTagAnimation()}
              key={tag.fieldValue}
              style={{transform: 'scale(0)'}}
              className="tag-box">
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                <span className="default tag-name">{tag.fieldValue}</span>
                <span className="default post-num">{tag.totalCount}</span>
              </Link>
            </TweenOne>
          ))}
        </ul>
      </div>
    )
  }
}

// const TagsPage = ({
//   data: { allMarkdownRemark: { group }, site: { siteMetadata: { title } } },
// }) => {
//   let value = '123';
//   let handleChange = val => {
//     console.log(val.target.value)
//     value = val.target.value.toUpperCase();
//   }
//   return (
//     <div className="page-tags">
//       <Helmet title={`tags - Lighted mirror`} />
//       <Input placeholder="Basic usage" value={value} onChange={handleChange}/>
//       <ul>
//         <QueueAnim delay={200}>
//           {group.map(tag => (
//             <li key={tag.fieldValue} className="tag-box">
//               <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
//                 <span className="default tag-name">{tag.fieldValue}</span>
//                 <span className="default post-num">{tag.totalCount}</span>
//               </Link>
//             </li>
//           ))}
//         </QueueAnim>
//       </ul>
//     </div>
//   )
// };

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
      authors: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
};

export default TagsPage;

export const pageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
    ) {
      tags: group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
      authors: group(field: frontmatter___author) {
        fieldValue
        totalCount
      }
    }
  }
`;