module.exports = {
  siteMetadata: {
    title: 'lighted-mirror',
  },
  plugins: [{
      resolve: 'gatsby-source-filesystem',
      options: {
        path: './posts',
        name: 'markdown-pages',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-remark'
  ],
};
