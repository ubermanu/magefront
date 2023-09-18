import { get_docs_data } from '$lib/server/docs.js'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  event.locals.docs = await get_docs_data()
  return await resolve(event)
}
