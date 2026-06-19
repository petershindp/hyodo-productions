export default {
  name: 'hero',
  title: 'Hero',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Hero Title',
      type: 'string',
    },
    {
      name: 'reel',
      title: 'Hero Reel',
      type: 'file',
      options: {
        accept: 'video/*',
      },
    },
  ],
}
