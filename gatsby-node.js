const path = require('path');
const { GraphQLString } = require('graphql');
/* 将 Markdown 文件创建成推文页面 */
exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;
  const blogPostTemplate = path.resolve('src/templates/post.js');

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              parent
            }
          }
        }
      }
    }
  `).then(result => {
      if (result.errors) {
        return Promise.reject(result.errors);
      }

      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        let path = node.frontmatter.parent.split(' ')[0].split('/');
        path.shift();
        path[path.length - 1] = path[path.length - 1].split('.')[0];
        path = `/${path.join('/')}`;

        createPage({
          path: path,
          component: blogPostTemplate,
          context: {
            url: path
          }, // additional data can be passed via context
        });
      });
    });
};











exports.modifyWebpackConfig = ({ config, stage }) => {
  const lessLoaderConf = {
    test: /\.less$/,
    loader: 'style!css!less'
  };
  switch (stage) {
    case 'develop':
      config.loader('less', lessLoaderConf);
      break;

    case 'build-css':
      config.loader('less', lessLoaderConf);
      break;

    case 'build-html':
      config.loader('less', lessLoaderConf);
      break;

    case 'build-javascript':
      config.loader('less', lessLoaderConf);
      break;
  }
  return config;
}

const getURL = node => {
  console.log(node);
  /* See the source link below for implementation */
};

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== 'MarkdownRemark') {
    return {};
  }

  return Promise.resolve({
    url: {
      type: GraphQLString,
      resolve: node => getURL(node),
    },
  });
};