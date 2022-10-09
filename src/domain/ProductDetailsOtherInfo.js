import React from 'react'
import {
  withStyles, Box, Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

const ProductDetailsOtherInfo = ({ data, classes }) => {
  const [expanded, setExpanded] = React.useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <>
      <Box className={classes.content}>
        {data?.description_secondary.map(({ title, content }, i) => (
          <Accordion
            key={title}
            className={classes.accordian}
            expanded={expanded === i}
            onChange={handleChange(i)}
          >
            <AccordionSummary
              expandIcon={
                expanded === i
                  ? <AiOutlineMinus />
                  : <AiOutlinePlus />
              }
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography variant='body1'><b>{title}</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='subtitle2'>
                {content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  )
}

const styles = () => ({
  content: {
    // display: 'flex',
    // flexDirection: 'column',
    display: 'block'
  },
  heading: {
    fontSize: '16px'
  },
  accordian: {
    boxShadow: 'none',
    background: 'transparent !important',
    '& div': {
      padding: '0'
    },
    '& .MuiAccordionSummary-content': {
      margin: '20px 0'
    }
  }
})

export default withStyles(styles, { withTheme: true })(ProductDetailsOtherInfo)
