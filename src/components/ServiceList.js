import React, { useState } from 'react'
import { withStyles, Box, Typography, Grid, Card, CardContent, CardActionArea, Modal, Backdrop } from '@material-ui/core'
import { useSpring, animated } from 'react-spring'

const ServiceList = ({ data, classes }) => {
  const _data = data.data

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        spacing={4}
      >
        {
          _data.map((item, index) => {
            const { image, title } = _data[index]
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={6} variant='outlined'>
                  <CardActionArea onClick={handleOpen} className={classes.item}>
                    {/* <CardMedia
                      component='img'
                      alt={title}
                      className={classes.image}
                      image={image}
                      title={title}
                    /> */}
                    <Box display='flex' justifyContent='center' alignItems='center' padding={8}>
                      <img
                        alt='Scouting'
                        src={image}
                        className={classes.image}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant='h5' component='h3' align='center' className={classes.title}>{title}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })
        }
      </Grid>
      <Modal
        aria-labelledby='spring-modal-title'
        aria-describedby='spring-modal-description'
        className={classes.modal}
        open={isModalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={isModalOpen} className={classes.modalContentContainer}>
          <div className={classes.modalContent}>
            <h2 id='spring-modal-title'>Title</h2>
            <p id='spring-modal-description'>Content will show here.</p>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

const Fade = React.forwardRef(function Fade (props, ref) {
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

const styles = (theme) => ({
  item: {
    height: '450px'
  },
  image: {
    maxHeight: '180px',
    maxWidth: '100%'
  },
  title: {
    fontWeight: theme.typography.fontWeightBold
  },
  modal: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'center'
  },
  modalContentContainer: {
    width: '100%'
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    height: '70vh',
    padding: theme.spacing(2, 4, 3),
    width: '100%'
  }
})

export default withStyles(styles, { withTheme: true })(ServiceList)
