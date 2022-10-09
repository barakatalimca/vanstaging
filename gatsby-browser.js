/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
// import Provider from './src/domain/provider';
import RootProvider from './src/providers'
export const wrapRootElement = RootProvider
export const onServiceWorkerUpdateReady = () => window.location.reload()

// export const wrapRootElement = Provider;
