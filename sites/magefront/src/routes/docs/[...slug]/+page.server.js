import { render_markdown } from '$lib/server/docs.js'
import { error } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals }) => {
  const { slug } = params

  // Find the document that matches the slug.
  const doc = locals.docs.find((doc) => doc.slug === slug)

  // If no document matches the slug, return a 404.
  if (!doc) {
    throw error(404, `Document not found`)
  }

  const { code, data } = await render_markdown(doc.content)

  return {
    content: code,
    metadata: data,
  }
}
