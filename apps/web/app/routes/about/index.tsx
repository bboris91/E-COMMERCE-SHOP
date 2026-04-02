import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { aboutPageQuery } from '../../queries/about'
import { HeaderSection } from './sections/HeaderSection'
import { StorySection } from './sections/StorySection'
import { ValuesSection } from './sections/ValuesSection'
import { MissionSection } from './sections/MissionSection'

type AboutPageData = {
  heading: string
  subheading: string | null
  storyHeading: string | null
  storyParagraphs: string[] | null
  storyImage: string | null
  valuesHeading: string | null
  values: { icon: string | null; title: string; description: string | null }[] | null
  missionHeading: string | null
  missionText: string | null
  seo: { title: string | null; description: string | null } | null
}

export async function loader() {
  const about = await sanityFetch<AboutPageData>(aboutPageQuery)
  return { about }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.about?.seo?.title ?? 'O nama – Flora Bianca'
  const description = loaderData?.about?.seo?.description ?? 'Saznajte više o Flora Bianca.'
  return [{ title }, { name: 'description', content: description }]
}

export default function About({ loaderData }: Route.ComponentProps) {
  const { about } = loaderData

  if (!about) return null

  return (
    <main>
      <HeaderSection heading={about.heading} subheading={about.subheading} />
      <StorySection heading={about.storyHeading} paragraphs={about.storyParagraphs} image={about.storyImage} />
      <ValuesSection heading={about.valuesHeading} values={about.values} />
      <MissionSection heading={about.missionHeading} text={about.missionText} />
    </main>
  )
}
