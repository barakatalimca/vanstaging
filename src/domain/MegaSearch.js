import React, { useMemo, useState } from 'react'
import { withStyles, Box, Typography, IconButton, useTheme, Avatar } from '@material-ui/core'
import Autocomplete from 'react-autocomplete'
import { BiSearch } from 'react-icons/bi'
import { BsChevronRight } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr'
import clsx from 'clsx'

import '../styles/header-navigation.css'
import { navigate } from '../components/common/Router'
import { ErrorBoundary, Image } from '../components'
import { useAllProductsData, useI18n } from '../helpers'

const MegaSearch = ({ onClose = () => { }, classes }) => {
  const theme = useTheme()
  const allProducts = useAllProductsData()
  const i18n = useI18n()

  const [queryTerm, setQueryTerm] = useState('')

  const flattenedData = useMemo(() => {
    if (
      !allProducts ||
      !allProducts.data ||
      allProducts.data.length === 0
    ) {
      return []
    }

    const result = []

    const normalizedCategoryListData = allProducts.data
      .map(category => ({
        id: `c${category.category_id}`,
        title: category.category_name,
        type: 'category',
        subtitle: null,
        slug: `/products/${category.category_slug}`,
        image: category.image
      }))

    const normalizedProductListData = allProducts.data
      .map(category => ({
        ...category,
        product_data: category.product_data.map(product => ({
          id: `p${product.product_id}`,
          parentId: `c${category.category_id}`,
          title: product.product_name,
          type: 'product',
          subtitle: category.category_name,
          slug: `/product/${category.category_slug}/${product.product_slug}`,
          image: product.image
        }))
      }))
      .map(({ product_data }) => product_data)
      .flat()

    normalizedCategoryListData.forEach(category => {
      result.push(category)
      result.push(normalizedProductListData.filter(product => product.parentId === category.id))
    })

    return result.flat()
  }, [allProducts])

  const handleClose = () => {
    onClose()
  }

  return (
    <ErrorBoundary>
      <div className={classes.root} dir='ltr'>
        <Autocomplete
          getItemValue={(item) => item.title}
          items={flattenedData}
          inputProps={{
            placeholder: i18n === 'ar' ? 'بحث' : 'Search',
            className: classes.searchInput,
            autoFocus: true
          }}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.id}
              className={clsx(
                classes.autocompleteSuggestedItem,
                'searchItem'
                // item.type === 'product' && classes.autocompleteSuggestedItemIndented
              )}
              style={{
                background: isHighlighted ? 'lightgray' : 'white'
              }}
            >
              <Box display='flex' alignItems='center'>
                <Box paddingRight={2}>
                  <Avatar variant='rounded' className={classes.suggestedItemImage}>
                    <Image src={item.image} />
                  </Avatar>
                </Box>
                <div>
                  <Typography variant='body1'>
                    {item.title}
                  </Typography>
                  {item.subtitle && (
                    <Typography variant='caption' style={{ opacity: 0.5 }}>
                      {item.subtitle}
                    </Typography>
                  )}
                </div>
              </Box>
              <BsChevronRight />
            </div>
          )}
          value={queryTerm}
          shouldItemRender={(state, value) => {
            return state.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
          }}
          onChange={(_event, value) => {
            setQueryTerm(value)
          }}
          onSelect={(value, item) => {
            navigate(item.slug)
            handleClose()
          }}
          menuStyle={{
            ...stylesObject.autocompleteSuggestionMenu,
            backgroundColor: theme.palette.background.paper
          }}
          wrapperStyle={stylesObject.autocompleteRoot}
        />
        <div className={classes.searchIcon}>
          <BiSearch size={32} />
        </div>
        <IconButton
          onClick={handleClose}
          className={classes.closeIcon}
        >
          <GrClose size={32} />
        </IconButton>
      </div>
    </ErrorBoundary>
  )
}

const styles = (theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    position: 'relative'
  },
  autocompleteSuggestedItem: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(4)
  },
  autocompleteSuggestedItemIndented: {
    paddingLeft: theme.spacing(8)
  },
  suggestedItemImage: {
    '& > div': {
      height: '100%',
      width: '100%'
    }
  },
  searchInput: {
    border: 0,
    fontSize: '200%',
    height: '100%',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%'
  },
  searchIcon: {
    alignItems: 'center',
    display: 'flex',
    color: theme.palette.grey[600],
    height: '100%',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: theme.spacing(8),
    zIndex: 1
  },
  closeIcon: {
    position: 'absolute',
    right: 0
  }
})

const stylesObject = {
  autocompleteRoot: {
    display: 'block',
    flexGrow: 1,
    height: '100%'
  },
  autocompleteSuggestionMenu: {
    cursor: 'pointer',
    height: '100vh',
    maxWidth: '320px',
    overflowY: 'auto',
    position: 'fixed',
    zIndex: 1,
    transition: 'all 0.2s ease-in-out'
  },
  autocompleteLoader: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    right: '25px',
    top: '12px',
    opacity: 0.5
  }
}

export default withStyles(styles, { withTheme: true })(MegaSearch)
