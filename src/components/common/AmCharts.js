import React from 'react'

const AmCharts = () => {
  /*
  AmCharts expects window to be defined. During build “window is not defined” error would show up.
  https://www.gatsbyjs.org/docs/debugging-html-builds/#how-to-check-if-code-classlanguage-textwindowcode-is-defined
  https://stackoverflow.com/questions/53322761/gatsbyjs-build-window-is-not-defined-module-is-not-defined
*/
  if (typeof window !== 'undefined') {
    // https://github.com/amcharts/amcharts3-react/issues/51#issuecomment-336514497
    require('amcharts3')
    require('amcharts3/amcharts/serial')
    const ReactAmCharts = require('@amcharts/amcharts3-react')
    // https://github.com/amcharts/ammap3/issues/15#issuecomment-289269846
    require('ammap3/ammap/ammap')

    return (
      <ReactAmCharts />
    )
  }

  return null
}

export default AmCharts
