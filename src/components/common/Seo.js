import React from 'react'
import { Helmet } from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { useI18n } from '../../helpers'

const Seo = (props) => {
  const i18n = useI18n()

  return <StaticQuery
    query={detailsQuery}
    render={(data) => {
      const title = props.title || data.site.siteMetadata.defaultTitle
      return (
        <Helmet
          htmlAttributes={{
            lang: i18n.locale
          }}
          titleTemplate={`%s - ${data.site.siteMetadata.company}`}
        >
          <title>{title}</title>
          <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
          {props.children}
        </Helmet>
      )
    }}
         />
}

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        defaultTitle
        company
      }
    }
  }
`

Seo.defaultProps = {
  keywords: [],
  lang: 'en',
  meta: []
}

export default Seo
