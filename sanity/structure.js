import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export const structure = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('hero').title('Site Settings'),
      orderableDocumentListDeskItem({
        type: 'work',
        title: 'Work',
        S,
        context,
      }),
      ...S.documentTypeListItems().filter(
        (item) => !['hero', 'work'].includes(item.getId()),
      ),
    ])
