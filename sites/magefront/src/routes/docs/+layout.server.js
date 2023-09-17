import { render_markdown } from '$lib/server/docs.js'

export const prerender = true

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals, params }) => {
  const { docs } = locals

  // Find the document that matches the slug.
  const docId = docs.findIndex((doc) => doc.slug === params.slug)

  async function extract_metadata_and_slug(id) {
    if (id < 0 || id >= docs.length) return null
    const doc = docs[id]
    const { metadata } = await render_markdown(doc.content)
    return { metadata, slug: doc.slug }
  }

  return {
    pagination: {
      previous: await extract_metadata_and_slug(docId - 1),
      next: await extract_metadata_and_slug(docId + 1),
    },
  }
}
