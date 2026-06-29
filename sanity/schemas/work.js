export default {
  name: 'work',
  title: 'Work',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'projectId',
      title: 'Project Slug',
      type: 'string',
      description: 'Used in the URL: /work/[slug]. No spaces or special characters.',
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          name: 'slug',
          invert: false,
        }).error('Use lowercase letters, numbers and hyphens only (e.g. "neon-province")'),
    },
    {
      name: 'client',
      title: 'Client',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Feature Film', value: 'Feature Film'},
          {title: 'Short Film', value: 'Short Film'},
          {title: 'Documentary', value: 'Documentary'},
          {title: 'Commercial', value: 'Commercial'},
          {title: 'Music Video', value: 'Music Video'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Release Year',
      type: 'date',
      options: {
        dateFormat: 'YYYY',
      },
      description: 'Controls sort order — most recent appears first in the hero and grid.',
    },
    {
      name: 'description',
      title: 'Project Description',
      type: 'text',
      rows: 4,
      description: 'Short description shown on the project detail page.',
    },

    // Media
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Shown in the work grid. Also used as a fallback in the hero when no preview video is uploaded.',
    },
    {
      name: 'video',
      title: 'Preview Video',
      type: 'file',
      options: {accept: 'video/*'},
      description: 'Plays in the hero carousel and on card hover. Keep under 20 MB for fast loading.',
    },
    {
      name: 'videoLink',
      title: 'Embed Video URL',
      type: 'url',
      description: 'Vimeo or YouTube embed URL (e.g. https://player.vimeo.com/video/…). Shown on the project detail page.',
    },
    {
      name: 'aspectRatio',
      title: 'Embed Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: '16:9 — Widescreen', value: '16/9'},
          {title: '4:3 — Standard', value: '4/3'},
          {title: '2.39:1 — Cinemascope', value: '2.39/1'},
          {title: '1.85:1 — Academy flat', value: '1.85/1'},
          {title: '9:16 — Vertical', value: '9/16'},
          {title: '1:1 — Square', value: '1/1'},
        ],
        layout: 'radio',
      },
      initialValue: '16/9',
      description: 'Must match the aspect ratio of the embed video URL above.',
    },
    {
      name: 'stills',
      title: 'Project Stills',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'Gallery images shown below the video on the project detail page.',
    },
  ],

  orderings: [
    {
      title: 'Newest First',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Oldest First',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      client: 'client',
      category: 'category',
      media: 'thumbnail',
    },
    prepare({title, client, category, media}) {
      const subtitle = [category, client].filter(Boolean).join(' — ')
      return {title, subtitle, media}
    },
  },
}
