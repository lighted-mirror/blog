module.exports = {
  siteMetadata: {
    title: 'lighted-mirror',
    startyear: '2018',
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
