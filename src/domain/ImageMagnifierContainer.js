import React from 'react'
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import {
  withStyles,
  Grid
} from '@material-ui/core'

const ImageMagnifierContainer = ({ classes, data }) => {
  return (
    <>
      <CarouselProvider
        totalSlides={5}
      >
        <div>
          <Grid container>
            <Grid item className={classes.sliderImages} md={11} lg={11} xs={11} sm='11' style={{ paddingLeft: '15px' }}>
              <Slider>
                {data.map((l) => (
                  <>
                    <Slide className={classes.item} index={0}>
                      <img src={l.image} />
                    </Slide>
                  </>
                ))}

              </Slider>
            </Grid>
          </Grid>
          <ButtonBack className={classes.ButtonBack}><i className='ion-chevron-left' /></ButtonBack>
          <ButtonNext className={classes.ButtonNext}><i className='ion-chevron-right' /></ButtonNext>
        </div>
      </CarouselProvider>
    </>
  )
}

const styles = () => ({

})

export default withStyles(styles, { withTheme: true })(ImageMagnifierContainer)
