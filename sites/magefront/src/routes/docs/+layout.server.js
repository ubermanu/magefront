import { render_markdown } from '$lib/server/docs.js'
import Case from 'case'

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

  const previous = await extract_metadata_and_slug(docId - 1)
  const next = await extract_metadata_and_slug(docId + 1)

  // Generate the sidebar menu tree.
  const sidebar = docs.reduce(
    (tree, doc) => {
      const parts = doc.slug.split('/')
      let branch = tree
      for (const part of parts) {
        if (!branch.children) branch.children = []
        let node = branch.children.find((node) => node.name === part)
        if (!node) {
          node = { name: part, title: Case.title(part) }
          branch.children.push(node)
        }
        branch = node
      }
      branch.slug = doc.slug
      return tree
    },
    { children: [] }
  )

  return {
    sidebar,
    pagination: { previous, next },
  }
}
