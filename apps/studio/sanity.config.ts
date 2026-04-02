import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from '@repo/sanity'
import { structure } from './structure'

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID
const dataset = import.meta.env.SANITY_STUDIO_DATASET

export default defineConfig({
  name: 'default',
  title: 'E-Commerce Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool(),
    presentationTool({
      previewUrl: {
        origin: import.meta.env.SANITY_STUDIO_PREVIEW_URL ?? 'http://localhost:5173',
        preview: '/',
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
