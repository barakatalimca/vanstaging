import React from 'react'
import { withStyles, Box } from '@material-ui/core'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import FacebookIcon from '@material-ui/icons/Facebook'
import InstagramIcon from '@material-ui/icons/Instagram'
import TwitterIcon from '@material-ui/icons/Twitter'
import YouTubeIcon from '@material-ui/icons/YouTube'

const SocialLinks = ({ isInverted, classes }) => {
  const socialLinks = [
    // { name: 'WhatsApp', icon: <WhatsAppIcon />, link: '' },
    { name: 'YouTube', icon: <YouTubeIcon />, link: 'https://www.youtube.com/channel/' },
    { name: 'Instagram', icon: <InstagramIcon />, link: 'https://www.instagram.com/' },
    { name: 'Twitter', icon: <TwitterIcon />, link: 'https://twitter.com/c' },
    { name: 'Facebook', icon: <FacebookIcon />, link: 'https://www.facebook.com/' }
  ]
  return (
    <Box display='flex' flexDirection='row'>
      {socialLinks.map(({ name, icon, link }) => (
        <a key={name} href={link} target='_blank' rel='noopener noreferrer' className={classes.item}>{icon}</a>
      ))}
    </Box>
  )
}

const styles = (theme) => ({
  item: {
    // color: props => props.isInverted ? theme.palette.common.white : theme.palette.primary.main,
    color: '#94959A',
    alignItems: 'center',
    display: 'flex',
    height: '60px',
    justifyContent: 'center',
    width: '60px'
  }
})

export default withStyles(styles, { withTheme: true })(SocialLinks)
