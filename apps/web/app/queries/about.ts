import { defineQuery } from 'groq'

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0] {
    heading,
    subheading,
    storyHeading,
    storyParagraphs,
    "storyImage": storyImage.asset->url,
    valuesHeading,
    values[] {
      icon,
      title,
      description
    },
    missionHeading,
    missionText,
    seo
  }
`)
