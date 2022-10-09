import React, { useState, useEffect } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Container,
  Breadcrumbs
} from '@material-ui/core'
import Page from '../components/Page'
// import OrderTracker from '../components/OrderTracker'
import Seo from '../components/common/Seo'
import FaqContainer from '../domain/FaqContainer'
import { Link } from '../components/common/Router'
import Fade from 'react-reveal/Fade'
import { FormattedMessage } from 'gatsby-plugin-intl'
import { useCms } from '../helpers/useCms'
import Api from '../Api'

const LIST = {
  tabs: [
    {
      id: 1,
      title: 'Order'
    },
    {
      id: 2,
      title: 'About Product'
    },
    {
      id: 3,
      title: 'Return Policy'
    },
    {
      id: 4,
      title: 'Payments'
    }, {
      id: 5,
      title: 'Shipping and delivery'
    }, {
      id: 6,
      title: 'Modify Order'
    }
  ],
  tabContents: [{
    tabId: 1,
    items: [
      {
        id: 4,
        question: 'What is the order method?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 5,
        question: ' How can I make sure my order is complete?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 6,
        question: ' Are there branches at Vangava?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      }
    ]
  },
  {
    tabId: 2,
    items: [
      {
        id: 4,
        question: 'What is the order method?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 5,
        question: ' How can I make sure my order is complete?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 6,
        question: ' Are there branches at Sayyar?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      }
    ]
  }, {
    tabId: 3,
    items: [
      {
        id: 4,
        question: 'What is the order method?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 5,
        question: ' How can I make sure my order is complete?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 6,
        question: ' Are there branches at Vangava?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      }
    ]
  }, {
    tabId: 4,
    items: [
      {
        id: 4,
        question: 'What is the order method?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 5,
        question: ' How can I make sure my order is complete?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 6,
        question: ' Are there branches at Sayyar?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      }
    ]
  }, {
    tabId: 5,
    items: [
      {
        id: 4,
        question: 'What is the order method?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 5,
        question: ' How can I make sure my order is complete?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 6,
        question: ' Are there branches at Vangava?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      }
    ]
  }, {
    tabId: 6,
    items: [
      {
        id: 4,
        question: 'What is the order method?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 5,
        question: ' How can I make sure my order is complete?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      },
      {
        id: 6,
        question: ' Are there branches at Sayyar?',
        answer: 'Select your favorite products and add to cart by selecting "Add to Cart" When you choose to finish the order, complete the payment details, write the address in detail, and complete your purchase'

      }
    ]
  }
  ]
}

const FAQs = ({ classes }) => {
  const cms = useCms()
  const [data, setData] = React.useState('')

  useEffect(() => {
    cms.getFaqData()
  }, [])

  return (
    <Page>
      <Fade>
        <Seo title='FAQs' />
        <Box>
          <Container>
            <Box marginTop={16}>
              <Breadcrumbs aria-label='breadcrumb' className='breadcrumb'>
                <Link color='inherit' to='/'><FormattedMessage id='Home' /></Link>
                <Typography color='textPrimary'><FormattedMessage id='FAQs' /></Typography>
              </Breadcrumbs>
            </Box>
            <Box marginBottom={5} display='flex' flexDirection='column'>
              <Typography variant='h3' component='h3'><FormattedMessage id='FAQs' /></Typography>
            </Box>
            <FaqContainer data={data} />
          </Container>
        </Box>
      </Fade>
    </Page>
  )
}
const styles = (theme) => ({

})
export default withStyles(styles, { withTheme: true })(FAQs)
