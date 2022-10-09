import React from 'react'
import {
  withStyles,
  useTheme,
  Box,
  Typography
} from '@material-ui/core'
import {
  Timeline as MaterialUiTimeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@material-ui/lab'

const Timeline = ({ data = [] }) => {
  const theme = useTheme()

  const renderItem = ({
    image,
    title,
    description,
    isCompleted,
    date
  }) => {
    // const hideConnector = title === 'Cancelled'
    const hideConnector = title === ''
    return (
      <TimelineItem className='timeline'>
        <TimelineSeparator>
          {/* {title === 'Placed' ? <TimelineDot color='primary' /> : <TimelineDot />}
          {title === 'Placed' ? <TimelineConnector color='primary' /> : <TimelineConnector />} */}
          <TimelineDot color='primary' />
          {!hideConnector && <TimelineConnector color='primary' />}
        </TimelineSeparator>
        <TimelineContent>
          <Box display='flex'>
            <Box width={theme.spacing(4)} marginRight={theme.spacing(0.25)}>
              <img src={image || require('../assets/svg/shopping-bag.svg')} style={{ width: '30px', height: '30px' }} />
            </Box>
            <Typography variant='body1'>{title}</Typography>
          </Box>
          <Box marginLeft={theme.spacing(0.75)}>
            <Typography variant='subtitle2'>
              {<>
                <>
                  {title === 'Placed'
                    ? <>Order placed on </>
                    : title === 'Under Processing' ? <>Under Processing since</>
                      : title === 'Out for Delivery' ? <>Out for Delivery on</>
                        : title === 'Delivered' ? <>Delivered on</>
                          : title === 'Cancelled' ? <>Cancelled on</>
                            : title === 'Returned' ? <>Returned on</>
                              : title === 'Undelivered' ? <>Undelivered on</>
                                : <></>}
                </><>{date}</>
               </>}

            </Typography>
          </Box>
          <Box height={theme.spacing(4)} />
        </TimelineContent>
      </TimelineItem>
    )
  }

  return (
    <MaterialUiTimeline align='left'>
      {data?.map(item => renderItem(item))}
    </MaterialUiTimeline>
  )
}

const styles = (theme) => ({

})

export default withStyles(styles, { withTheme: true })(Timeline)
