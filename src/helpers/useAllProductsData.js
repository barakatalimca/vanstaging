// Hook (use-auth.js)
import React, { useContext, createContext, useMemo } from 'react'
import { useQuery } from 'react-query'

import Api from '../Api'
import { PRODUCT_LIST_DATA } from '../Constants'

const allProductsDataContext = createContext()

export function AllProductsDataProvider ({ children }) {
  const data = useProductsData()
  return (
    <allProductsDataContext.Provider value={data}>
      {children}
    </allProductsDataContext.Provider>
  )
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAllProductsData = () => {
  return useContext(allProductsDataContext)
}

// Provider hook that creates auth object and handles state
function useProductsData () {
  const [_data, setData] = React.useState([])
  const [bundledProductListData, setBundledProductListData] = React.useState([])
  // const [productListData, setProductListData] = React.useState([])
  const [reload, setReload] = React.useState(0)

  const { isLoading, error, data } = useQuery(PRODUCT_LIST_DATA, Api.fetchProductListData)

  const reloader = () => {
    setReload(prev => prev + 1)
  }

  React.useEffect(() => {
    if (data && data.data) {
      // console.log(data.data.data)
      setData(data.data.data)
    }
  }, [data])

  const categoryListData = useMemo(() => {
    if (!_data || _data.length === 0) {
      return []
    }

    return _data
      .map(category => ({
        id: `c${category.category_id}`,
        title: category.category_name,
        type: 'category',
        subtitle: null,
        slug: `/products/${category.category_slug}`,
        image: category.image
      }))
  }, [_data])

  const productListData = useMemo(() => {
    if (!_data || _data.length === 0) {
      return []
    }

    return _data
      .map(category => ({
        ...category,
        product_data: category.product_data.map(product => ({
          ...product,
          category_id: `c${category.category_id}`,
          category_name: category.category_name,
          product_sku_data: product.product_sku_data
        }))
      }))
      .map(({ product_data }) => product_data)
      .flat()
  }, [_data])

  const searchData = useMemo(() => {
    if (categoryListData.length === 0 && productListData.length === 0) {
      return []
    }

    const result = []

    categoryListData.forEach(category => {
      result.push(category)
      result.push(productListData.filter(product => product.parentId === category.id))
    })

    return result.flat()
  }, [categoryListData, productListData])

  const productData = product_id => productListData.find(product => product.product_id === product_id)

  // Pass list of bundle product ids and SKU ids as param
  const normalizedBundledProductList = ({ productData, bundledProductList = [] }) => {
    if (productListData.length === 0) {
      return []
    }

    const bundledProductIds = productData && productData.bundled_product
      ? productData.bundled_product.map(p => p.product_id)
      : bundledProductList.map(p => p.product_id)
    const filterProductListData = productListData
      .filter(p => bundledProductIds.includes(p.product_id))
    let list = []

    if (productData) {
      list = productData.bundled_product
    } else {
      list = bundledProductList
    }

    return list?.map(bundledProductItem => {
      const concernedProduct = filterProductListData.find(item => item.product_id === bundledProductItem.product_id)

      return {
        ...concernedProduct,
        quantity: bundledProductItem.quantity,
        product_sku_data: concernedProduct?.product_sku_data
          .filter(s => bundledProductItem.product_sku_ids.includes(s.product_sku_id))
      }
    })
  }

  // Return the user object and auth methods
  return {
    isLoading,
    error,
    data: _data,
    reload,
    reloader,
    categoryListData,
    productListData,
    searchData,
    productData,
    normalizedBundledProductList
  }
}
