module.exports = {
  siteMetadata: {
    title: 'lighted-mirror',
  },
  pathPrefix: '/blog',
  plugins: [{
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/posts`,
        name: 'markdown-pages',

      },
    },
    {
      resolve: 'gatsby-plugin-less',
      options: {
        theme: `${__dirname}/src/theme.js`,
      },
    },
    {
      resolve: 'gatsby-plugin-antd'
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',
            },
          },
        ],
      },
    },
    'gatsby-plugin-react-helmet',
  ],
};
