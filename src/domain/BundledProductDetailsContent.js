import React, { useEffect, useState } from 'react'
import {
  withStyles,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import groupBy from 'lodash/groupBy'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { useAllProductsData } from '../helpers'
import BundledProductDetailsContentListItemHeader from './BundledProductDetailsContentListItemHeader'
import BundledProductDetailsContentListItem from './BundledProductDetailsContentListItem'
import { FormattedMessage } from 'gatsby-plugin-intl'

const BundledProductDetailsContent = ({ data, onChangeAttributes = () => { }, classes }) => {
  if (!data) {
    return <></>
  }

  const allProductsData = useAllProductsData()

  const [bundledProductListData, setBundledProductListData] = useState([])

  useEffect(() => {
    if (data) {
      setBundledProductListData(allProductsData.normalizedBundledProductList({ productData: data }))
    }
  }, [data])

  // return <></>
  const [selectedProductSkuList, setSelectedProductSkuList] = useState([])
  const [temporarySkuList, setTemporarySkuList] = useState([])
  const [expanded, setExpanded] = useState()

  const {
    bundled_product,
    category_slug,
    currency,
    description,
    description_secondary,
    discount,
    discount_price,
    image,
    in_sections,
    is_bundle,
    is_wished,
    price,
    product_id,
    product_name,
    product_sku_data,
    product_slug,
    sku_id,
    wished_id
  } = data

  const getGroupedSkuList = (productSkuData) => skuList => {
    if (!productSkuData) {
      const groupedSku = groupBy(temporarySkuList, 'product_id')
      const list = []

      for (const key in groupedSku) {
        list.push({
          product_id: key,
          product_sku_ids: groupedSku[key].map(item => {
            return { product_id: key, product_sku_id: item.product_sku_id, index: item.index }
          })
        })
      }

      return list
    }

    const {
      product_id,
      product_sku_id,
      index
    } = productSkuData

    const list = []

    for (const item of skuList) {
      list.push({
        product_id: item.product_id,
        product_sku_ids: item.product_sku_ids.map(item => {
          if (item.product_id === product_id && item.index === index) {
            return { ...item, product_sku_id }
          }

          return item
        })
      })
    }

    return list
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const _onChangeAttributes = (productSkuData) => {
    const {
      product_id,
      product_sku_id,
      index
    } = productSkuData

    const isProductAlreadyPresent = selectedProductSkuList
      .some(item => item.product_id === product_id)

    if (isProductAlreadyPresent) {
      setSelectedProductSkuList(getGroupedSkuList(productSkuData))
    } else {
      setTemporarySkuList(state => [...state, {
        product_id,
        product_sku_id,
        index
      }])
    }
  }

  useEffect(() => {
    onChangeAttributes(selectedProductSkuList)
  }, [selectedProductSkuList])

  useEffect(() => {
    if (temporarySkuList.length > 0) {
      setSelectedProductSkuList(getGroupedSkuList())
    }
  }, [temporarySkuList])

  return (
    <Box className={classes.root}>
      <Box paddingX={2} paddingBottom={2}>
        <Typography variant='h5' component='h2' gutterBottom>
          <b>{product_name}</b>
        </Typography>
        {discount_price && discount_price !== '' && (
          <>
            <Typography variant='body1'><strike>{currency}&nbsp;{price}</strike></Typography>
            <Typography variant='h6'>{currency} {discount_price}</Typography>
          </>
        )}
        {discount_price === '' && (
          <Typography variant='h6'>{currency} {price}</Typography>
        )}
      </Box>
      {/* {data?.description_secondary.map(({ title, content }, i) => ( */}
      {bundledProductListData.map((productData, i) => (
        <Accordion
          key={productData.product_id}
          className={classes.accordian}
          onChange={handleChange(i)}
          expanded={expanded === i}
        >
          <AccordionSummary
            expandIcon={
              expanded === i
                ? <BsChevronDown />
                : <small className={classes.customiseLink}><FormattedMessage id='Customize' /></small>
            }
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <BundledProductDetailsContentListItemHeader
              data={productData}
              index={i + 1}
            />
          </AccordionSummary>
          <AccordionDetails>
            <BundledProductDetailsContentListItem
              data={productData}
              onChangeAttributes={_onChangeAttributes}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

const styles = (theme) => ({
  root: {
    '.MuiAccordion-root:first-child .MuiAccordionSummary-root': {
      paddingTop: 0
    }
  },
  accordian: {
    boxShadow: 'none',
    '& .MuiAccordionSummary-root': {
      alignItems: 'flex-start',
      padding: theme.spacing(2, 0)
    },
    '& .MuiAccordionDetails-root': {
      padding: '0'
    },
    '& .MuiAccordionSummary-content': {
      margin: '0px 0'
    }
  },
  customiseLink: `
    font-size: 10px;
    position: relative;
    color: ${theme.palette.secondary.main};
    text-decoration: underline;  
  `
})

export default withStyles(styles, { withTheme: true })(BundledProductDetailsContent)
