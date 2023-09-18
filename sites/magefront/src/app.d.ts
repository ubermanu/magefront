// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      docs: Array<{ slug: string; content: string }>
    }
    interface PageData {
      sidebar?: { children: SidebarItem[] }
    }
    // interface Platform {}
  }

  interface SidebarItem {
    name: string
    title: string
    slug?: string
    children?: SidebarItem[]
  }
}

export {}
