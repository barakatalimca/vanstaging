import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import Fade from 'react-reveal/Fade'
import AddIcon from '@material-ui/icons/Add'
import { AiOutlineMinus } from 'react-icons/ai'
import { useCms } from '../helpers/useCms'

const FaqContainer = ({ classes, data }) => {
  const cms = useCms()
  const [expanded, setExpanded] = React.useState(false)
  const [value, setValue] = useState(0)
  const [dataList, setData] = useState([])
  const handleChangeAccordian = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleChange = (i) => {
    setValue(i)
    setExpanded(false)
  }

  useEffect(() => {
    setData(cms.faqs)
  }, [cms?.faqs])

  return (
    <>
      {console.log('data', dataList)}
      <Box paddingBottom={5}>
        <Grid container spacing={4}>
          <Grid item md={3} lg={3}>
            <Tabs
              value={value}
              variant='scrollable'
              orientation='vertical'
              textColor='primary'
            >
              {dataList?.map((l, i) => (
                <Tab
                  className={classes.tab}
                  value={i}
                  label={<b>{l.group_title}</b>}
                  onClick={() => handleChange(i)}
                  key={i}
                  {...a11yProps(i)}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item md={9} style={{ overflowX: 'hidden' }}>
            {dataList?.map((l, i) => (
              <>
                {l.faq_data?.map((item, index) => (
                  <TabPanel value={value} index={i} key={i}>
                    {console.log('item', item)}
                    <Fade>
                      <Box style={{ overflowX: 'auto' }}>
                        <Accordion
                          className={classes.accordian}
                          expanded={expanded === index}
                          onChange={handleChangeAccordian(index)}
                          key={index}
                        >
                          <AccordionSummary
                            expandIcon={
                              expanded === index
                                ? <AiOutlineMinus style={{ marginRight: '0' }} />
                                : <AddIcon style={{ marginRight: '0' }} />
                            }
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                          >
                            <b className={classes.heading}>{item.question}</b>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant='body1' component='p'>
                              {item.answer}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    </Fade>
                  </TabPanel>
                ))}
              </>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

const a11yProps = (index) => {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  }
}

const styles = (theme) => ({
  tab: {
    '& span': {
      alignItems: 'end'
    }
  },
  accordian: {
    boxShadow: 'none',
    '& .MuiPaper-elevation1': {
      boxShadow: 'none'
    }
  }
})
export default withStyles(styles, { withTheme: true })(FaqContainer)
