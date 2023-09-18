import { get_docs_data, render_markdown } from '$lib/server/docs.js'
import { error, redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals }) => {
  const { slug } = params

  // Redirect if the slug ends with ".md"
  // So the docs are still usable on git
  if (slug.endsWith('.md')) {
    throw redirect(301, `/docs/${slug.slice(0, -3)}`)
  }

  // Find the document that matches the slug.
  const doc = locals.docs.find((doc) => doc.slug === slug)

  // If no document matches the slug, return a 404.
  if (!doc) {
    throw error(404, `Document not found`)
  }

  const { content, metadata } = await render_markdown(doc.content)

  return {
    content,
    metadata,
  }
}

export const entries = async () => {
  const docs = await get_docs_data(false)
  return docs.map((doc) => ({ slug: doc.slug }))
}
