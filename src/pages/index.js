import React from 'react'

import Page from '../components/Page'
import Seo from '../components/common/Seo'
// import Hero from '../components/Hero'
import FeaturedListCarousel from '../components/FeaturedListCarousel'
import PreLoader from '../components/PreLoader'
import HomeSecondSection from '../domain/HomeSecondSection'
import { Intro, SectionTopCategories } from '../domain'
import { useI18n } from '../helpers'
import Hero from '../components/Hero'

const Home = ({ props }) => {
  const i18n = useI18n()

  return (
    <Page>
      <Seo title='Home' />
      <PreLoader />
      <Hero />
      <SectionTopCategories />
      <FeaturedListCarousel />
      <HomeSecondSection />
      <Intro />
    </Page>
  )
}

export default Home
