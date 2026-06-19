export default {
  name: 'work',
  title: 'work',
  type: 'document',
  fields: [
    {name: 'projectId', title: 'Project ID', type: 'string'},
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
    },
    {
      name: 'client',
      title: 'Project Client',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
    },
    {name: 'thumbnail', title: 'Thumbnail Image', type: 'image'},
    {
      name: 'stills',
      title: 'Project Stills',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    },
    {
      name: 'video',
      title: 'Thumbnail Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
    {
      name: 'videoLink',
      title: 'Project Video URL',
      type: 'url',
    },
    {name: 'aspectRatio', title: 'Aspect Ratio', type: 'string'},
  ],
}
