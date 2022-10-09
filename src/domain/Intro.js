import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import { useSpring, animated } from 'react-spring/web.cjs' // web.cjs is required for IE 11 support
import Confetti from 'react-dom-confetti'

import { useWindowSize } from '../helpers'
import { IconButton } from '@material-ui/core'
import { IoMdClose } from 'react-icons/io'
import { useCms } from '../helpers/useCms'

const confettiConfig = {
  angle: '218',
  spread: 360,
  startVelocity: 40,
  elementCount: '171',
  dragFriction: 0.12,
  duration: '7770',
  stagger: '20',
  width: '10px',
  height: '13px',
  perspective: '435px',
  colors: ['#f00', '#0f0', '#00f']
}

const Intro = () => {
  const classes = useStyles()
  const { width, height } = useWindowSize()
  const [open, setOpen] = React.useState(true)
  const [blast, setBlast] = React.useState(false)
  const isBrowser = typeof window !== 'undefined'
  const cms = useCms()
  const handleClose = () => {
    setOpen(false)
    if (isBrowser) {
      window.localStorage.setItem('introClosed', true)
    }
  }

  useEffect(() => {
    if (cms?.homePageData?.popup?.animation === 'Yes') {
      setTimeout(() => {
        setBlast(true)
      }, 500)
      if (isBrowser) {
        const closed = window.localStorage.getItem('introClosed')
        if (closed) {
          setOpen(false)
          setBlast(false)
        }
      }
    } else {
      setBlast(false)
    }
  }, [cms?.homePageData?.popup])

  return (
    <>
      {cms?.homePageData?.popup?.popup_image &&
        <>
          <div className='intro'>
            <Modal
              aria-labelledby='spring-modal-title'
              aria-describedby='spring-modal-description'
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500
              }}
            >
              <Fade in={open}>
                <div className='intro'>
                  <div className={classes.skipButtonContainer}>
                    <IconButton
                      aria-label='current language'
                      aria-haspopup='true'
                      onClick={handleClose}
                      color='inherit'
                    >
                      <IoMdClose color='#fff' size={32} />
                    </IconButton>
                  </div>
                  <div className={classes.background}>
                    <img src={cms?.homePageData?.popup?.background_image} className={classes.backgroundImage} />
                    <div className={classes.confettiContainer}>
                      <Confetti
                        active={blast}
                        config={confettiConfig}
                        width={width}
                        height={height}
                      />
                    </div>
                  </div>
                  <div className={classes.foreground}>
                    <img src={cms?.homePageData?.popup?.popup_image} className={classes.foregroundImage} />
                  </div>
                </div>
              </Fade>
            </Modal>
          </div>
        </>}
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  background: `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  `,
  confettiContainer: `
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  `,
  foreground: `
    max-height: 720px;
    max-width: 960px;
    position: relative;
    z-index: 1;
  `,
  foregroundImage: `
  box-shadow: 0 1px 1px rgba(0,0,0,0.11), 
              0 2px 2px rgba(0,0,0,0.11), 
              0 4px 4px rgba(0,0,0,0.11), 
              0 8px 8px rgba(0,0,0,0.11), 
              0 16px 16px rgba(0,0,0,0.11), 
              0 32px 32px rgba(0,0,0,0.11);  
    height: 100%;
    object-fit: contain;
    width: 100%;
  `,
  skipButtonContainer: {
    textAlign: 'right',
    position: 'relative',
    top: '0',
    zIndex: '99'
  }
}))

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter()
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited()
      }
    }
  })

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  )
})

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func
}

export default Intro
