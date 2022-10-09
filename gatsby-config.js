module.exports = {
  proxy: [
    {
      prefix: '/van',
      url: 'https://www.niwli.com'
    },
    {
      prefix: '/vangavacms',
      url: 'https://www.niwli.com'
    }
  ],
  // Customize me!
  siteMetadata: {
    title: 'vangava',
    description: 'The main e-commerce website for vangava',
    author: 'Kazma Technology Pvt. Ltd.',
    domain: 'https://www.vangava.com',
    defaultTitle: 'vangava is an original Saudi brand that deals with men\'s supplies such as Shimagh , fabrics and cottons designed from the finest natural Egyptian cotton, and was manufactured to the highest British standards and the most ancient global manufacturing methods.',
    preamble: 'The most precise and luxurious universal cotton, shumagh vangava designed of the highest standards in the UK and the ancient manufacturing methods. And because we care about the high end quality with a special touch to the fabric of our products, ensuring colour using the precise technologies available, and also using traditional adjustment machines to match the edges of shumagh with the highest accuracy.',
    defaultDescription: 'We develop exceptional products that meet real needs.',
    postamble: "Think we can help your project? We'd love to hear from you:",
    company: 'vangava',
    contact: {
      email: 'support@vangava.com'
    },
    menuLinks: []
  },
  pathPrefix: '',
  plugins: [
    {
      resolve: `gatsby-plugin-hotjar`,
      options: {
        includeInDevelopment: true, // optional parameter to include script in development
       // id: 2326592,
       // sv: 6,
       id: 3131118,
       sv: 6,
      } 
    },
      // {
      //   resolve: 'gatsby-plugin-google-gtag',
      //   options: {
  
      //     trackingIds: [
      //       "G-N9HC8827E0",
      //     ], 
      //   }
      // },
    'gatsby-transformer-json',
   //'gatsby-transformer-sharp',
   //'gatsby-plugin-sharp',
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-remove-serviceworker',
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        allowList: ['API_URL']
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        apiKey: process.env.API_KEY
      }
    },
    {
      resolve: 'gatsby-plugin-intl',
      options: {
        path: `${__dirname}/src/locales`,
        languages: ['ar', 'en'],
        defaultLanguage: 'ar',
        redirect: true
        // option to redirect to `/ar` when connecting `/`
      }
    },
    // {
    //   resolve: 'gatsby-plugin-favicon',
    //   options: {
    //     logo: './src/assets/img/favicon.png'
    //   }
    // },
    // {
    //   resolve: 'gatsby-plugin-google-analytics',
    //   options: {
    //     //trackingId: 'UA-120162676-1'
    //     trackingId: 'G-N9HC8827E0'
    //   }
    // },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Rubik', 'Cairo', 'Roboto']
        }
      }
    }
  ]
}
