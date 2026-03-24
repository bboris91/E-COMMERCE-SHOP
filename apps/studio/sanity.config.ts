import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@repo/sanity'

const projectId = process.env.SANITY_PROJECT_ID!
const dataset = process.env.SANITY_DATASET!

export default defineConfig({
  name: 'default',
  title: 'E-Commerce Studio',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
