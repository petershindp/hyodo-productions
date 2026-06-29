export default {
  name: 'hero',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Studio Name',
      type: 'string',
      description: 'Displayed as the persistent title overlaid on the hero carousel.',
      initialValue: 'Hyodo Productions',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'btsPhotos',
      title: 'BTS Photos',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'Behind-the-scenes photos shown in the carousel on the homepage About section.',
    },
  ],
}
