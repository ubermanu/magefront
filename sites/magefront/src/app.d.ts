// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      docs: Array<{
        slug: string
        content: string
        metadata?: Record<string, string>
      }>
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {}
