import { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProperties } from '@/components/home/FeaturedProperties'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { WhyComspace } from '@/components/home/WhyComspace'

export const metadata: Metadata = {
  title: 'Comspace — Find Your Perfect Space',
  description:
    'Discover unique homes, villas, cabins and apartments. Book your perfect stay with Comspace.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryStrip />
      <FeaturedProperties />
      <WhyComspace />
    </>
  )
}
