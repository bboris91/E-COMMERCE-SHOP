import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([

      // ─── Shop ─────────────────────────────────────────────────────
      S.listItem()
        .title('🏪 Shop')
        .child(
          S.list()
            .title('Shop')
            .items([
              S.listItem()
                .title('Products')
                .schemaType('product')
                .child(S.documentTypeList('product').title('Products')),
              S.listItem()
                .title('Categories')
                .schemaType('category')
                .child(S.documentTypeList('category').title('Categories')),
            ])
        ),

      S.divider(),

      // ─── Blog ─────────────────────────────────────────────────────
      S.listItem()
        .title('📝 Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Posts')
                .schemaType('post')
                .child(S.documentTypeList('post').title('Blog posts')),
              S.listItem()
                .title('Authors')
                .schemaType('author')
                .child(S.documentTypeList('author').title('Authors')),
            ])
        ),

      S.divider(),

      // ─── Pages ────────────────────────────────────────────────────
      S.listItem()
        .title('📄 Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              // Hero — singleton
              S.listItem()
                .title('Hero section')
                .child(
                  S.editor()
                    .title('Hero section')
                    .schemaType('heroSection')
                    .documentId('heroSection')
                ),
              // Generic pages list
              S.listItem()
                .title('Custom pages')
                .schemaType('page')
                .child(S.documentTypeList('page').title('Custom pages')),
            ])
        ),

      S.divider(),

      // ─── Site settings ────────────────────────────────────────────
      S.listItem()
        .title('⚙️ Site settings')
        .child(
          S.list()
            .title('Site settings')
            .items([
              S.listItem()
                .title('General')
                .child(
                  S.editor()
                    .title('General settings')
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
              S.listItem()
                .title('Navbar')
                .child(
                  S.editor()
                    .title('Navbar')
                    .schemaType('navbar')
                    .documentId('navbar')
                ),
              S.listItem()
                .title('Footer')
                .child(
                  S.editor()
                    .title('Footer')
                    .schemaType('footer')
                    .documentId('footer')
                ),
            ])
        ),
    ])
