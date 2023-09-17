import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export const load = async () => {
  throw redirect(301, '/docs/getting-started')
}
