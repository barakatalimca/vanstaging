exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions
  const matchPathProducts = page.path.match(/^\/([\w-]+)\/products/)
  const matchPathProduct = page.path.match(/^\/([\w-]+)\/product/)
  const matchPathUser = page.path.match(/^\/([\w-]+)\/user/)

  if (matchPathProducts) {
    page.matchPath = `${matchPathProducts[0]}/*`
    createPage(page)
  } else if (matchPathProduct) {
    page.matchPath = `${matchPathProduct[0]}/*`
    createPage(page)
  } else if (matchPathUser) {
    page.matchPath = `${matchPathUser[0]}/*`
    createPage(page)
  }
}
