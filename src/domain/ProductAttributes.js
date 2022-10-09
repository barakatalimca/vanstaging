import React, { useEffect, useMemo, useState } from 'react'
import {
  withStyles,
  Box,
  Typography
} from '@material-ui/core'
import _ from 'lodash'
import { FormattedMessage } from 'gatsby-plugin-intl'

import ErrorBoundary from '../components/ErrorBoundary'
import ProductAttribute from './ProductAttribute'

const ProductAttributes = ({ productSkuListData = [], onChange = () => { }, classes }) => {
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [selectedProductSku, setSelectedProductSku] = useState(null)

  const attributeGroups = useMemo(() => {
    const attrs = productSkuListData[0]?.attributes.map(({ attribute, label }) => {
      let data = _.uniqBy(productSkuListData.map(({ attributes }) => (
        attributes.find(item => item.attribute === attribute)
      )), 'value')
      if (attribute === 'Package(Pcs)' || attribute === 'Size(52-62)') {
        data = data.sort(function (a, b) {
          if (parseInt(a.value) < parseInt(b.value)) { return -1 }
          if (parseInt(a.value) > parseInt(b.value)) { return 1 }
          return 0
        })
      }
      return {
        id: attribute,
        title: label,
        data: data
      }
    })
    return attrs
  }, [productSkuListData]) || []

  const onClickAttribute = (attributeObj) => {
    if (!attributeObj) {
      setSelectedAttributes([])
    }

    // see if the list of selected attributes already contains the incoming attribute
    if (_.find(selectedAttributes, { attribute: attributeObj.attribute })) {
      setSelectedAttributes(
        _
          .filter(selectedAttributes, a => a.attribute !== attributeObj.attribute)
          .concat([attributeObj])
      )
    } else {
      setSelectedAttributes(a => _.concat(a, [attributeObj]))
    }
  }

  useEffect(() => {
    if (attributeGroups && selectedAttributes.length === attributeGroups.length) {
      const result = _.find(productSkuListData, ({ attributes }) => (
        _.isEqual(_.sortBy(attributes, 'attribute'), _.sortBy(selectedAttributes, 'attribute'))
      ))

      setSelectedProductSku(result)
      onChange(result)
    }
  }, [selectedAttributes])

  useEffect(() => {
    if (attributeGroups && attributeGroups.length > 0) {
      attributeGroups
        // .filter(groupItem => groupItem.data.filter(item => item.is_active === 'Yes'))
        .forEach(item => {
          if (item) {
            onClickAttribute(item.data[0])
          }
        })
    }
  }, [attributeGroups])

  return (
    <ErrorBoundary>
      {attributeGroups?.map(({ id, title, data }, index) => (
        <Box paddingY={1} key={id}>
          {/* <Typography variant='caption' gutterBottom>
            {title}&nbsp;<b>{selectedAttributes.find(item => item.attribute === id)?.display_value}</b>
          </Typography> */}
          <Box marginX={-0.5} marginY={0.5}>
            {data.map(attr => (
              <ProductAttribute
                attributeData={attr}
                key={attr?.value}
                selectedAttributes={selectedAttributes}
                onClickAttribute={onClickAttribute}
              />
            ))}
          </Box>
        </Box>
      ))}
      {/* <Box paddingY={2}>
        <Typography variant='caption' gutterBottom>  <FormattedMessage id='productSKU' /> </Typography>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='subtitle2'>
            {selectedProductSku
              ? selectedProductSku.sku_id
              : '-'}
          </Typography>
        </Box>
      </Box> */}
    </ErrorBoundary>
  )
}

const styles = (theme) => ({
  notify: {
    '& span': {
      // fontSize: '12px'
    }
  }
})

export default withStyles(styles, { withTheme: true })(ProductAttributes)
