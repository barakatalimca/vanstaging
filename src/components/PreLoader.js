import React from 'react'
import { withStyles } from '@material-ui/core'

const PreLoader = (props) => {
  const { classes } = props
  const [loader, setLoader] = React.useState(true)
  const [showLoader, setShowLoader] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 2500)
  }, [])

  React.useEffect(() => {
    if (loader === false) {
      setTimeout(() => {
        setShowLoader(false)
      }, 3500)
    }
  }, [loader])

  return (
    <>
      {showLoader && (
        <>
          <div className={loader === true ? (classes.fadeIn) : (classes.fadeOut)}>
            <style dangerouslySetInnerHTML={{
              __html: `
            .preloaderImage{width: 150px; border-radius: 5px}
            @media (max-width: 600px) {
              .preloaderImage { width: 75px; }
            }
          `
            }}
            />
            <div
              style={{
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: '99999'
              }}
            >
              <img
                className='preloaderImage'
                src={require('../assets/img/logo/vangavaIconoo.png')}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

const styles = (theme) => ({
  fadeIn: {
    opacity: '1',
    width: '100%',
    height: '100vh',
    zIndex: '99999',
    position: 'fixed',
    transition: 'width 0.5s, height 0.5s, opacity 0.5s 0.5s'
  },
  fadeOut: {
    opacity: '0',
    width: '0',
    height: '0',
    zIndex: '99999',
    position: 'fixed',
    transition: 'width 0.5s, height 0.5s, opacity 0.5s 0.5s'
  },
  preLoaderContainer: {
    '& img': `
    box-shadow: 0 1px 2px rgba(0,0,0,0.07), 
    0 2px 4px rgba(0,0,0,0.07), 
    0 4px 8px rgba(0,0,0,0.07), 
    0 8px 16px rgba(0,0,0,0.07),
    0 16px 32px rgba(0,0,0,0.07), 
    0 32px 64px rgba(0,0,0,0.07);
    `
  }
})

export default withStyles(styles, { withTheme: true })(PreLoader)
