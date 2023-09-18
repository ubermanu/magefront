import { base } from '$app/paths'
import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').PageLoad} */
export const load = async ({ url }) => {
  throw redirect(301, `${base}/docs/getting-started`)
}
