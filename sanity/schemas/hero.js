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
      name: 'footerLogo',
      title: 'Logo (Hero & Footer)',
      type: 'image',
      description: 'Logo used for the "HYODO" mask in the home hero and for the footer wordmark. Upload an SVG or PNG with a transparent background.',
    },
    {
      name: 'reelVideo',
      title: 'Reel Video',
      type: 'file',
      options: {accept: 'video/*'},
      description: 'Looping reel video shown in the home hero (plays through the HYODO letters).',
    },
    {
      name: 'reelLink',
      title: 'Reel Link',
      type: 'url',
      description: 'URL for the "Watch the full reel" button in the home hero (e.g. Vimeo or YouTube link).',
    },
    {
      name: 'btsPhotos',
      title: 'BTS / Team Photos',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'Behind-the-scenes and team photos shown in the mosaic on the About page.',
    },
  ],
}
