import { render_markdown } from '$lib/server/docs.js'

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, params, depends }) => {
  const { docs } = locals

  depends('pagination')

  // Find the document that matches the slug.
  const docId = docs.findIndex((doc) => doc.slug === params.slug)

  async function extract_metadata_and_slug(id) {
    if (id < 0 || id >= docs.length) return null
    const doc = docs[id]
    const { metadata } = await render_markdown(doc.content)
    return { metadata, slug: doc.slug }
  }

  const previous = await extract_metadata_and_slug(docId - 1)
  const next = await extract_metadata_and_slug(docId + 1)

  return {
    pagination: { previous, next },
  }
}
