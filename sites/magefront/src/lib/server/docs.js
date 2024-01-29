// @ts-nocheck
import { compile, defineMDSveXConfig, escapeSvelte } from 'mdsvex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkToc from 'remark-toc'
import * as shiki from 'shiki'

export async function get_docs_data(withContent = true) {
  const files = import.meta.glob('../../../../../docs/**/!(_)*.md', {
    as: 'raw',
  })

  const docs = await Promise.all(
    Object.entries(files).map(async ([path, resolver]) => {
      return {
        slug: path.replace('../../../../../docs/', '').replace('.md', ''),
        content: withContent ? await resolver?.() : '',
      }
    })
  )

  // If the slug is "getting-started", make sure it's the first document.
  return docs.sort((a, b) => {
    if (a.slug === 'getting-started') return -1
    if (b.slug === 'getting-started') return 1
    return a.slug.localeCompare(b.slug)
  })
}

const config = defineMDSveXConfig({
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await shiki.getHighlighter({
        themes: ['material-theme-darker'],
        langs: ['shell', 'javascript', 'text', 'less', 'css'],
      })

      return escapeSvelte(
        highlighter.codeToHtml(code, {
          lang,
          theme: 'material-theme-darker',
        })
      )
    },
  },
  remarkPlugins: [[remarkToc, { tight: true }]],
  rehypePlugins: [rehypeSlug, rehypePrettyCode],
})

/** @param {string} markdown */
export async function render_markdown(markdown) {
  const { code, data } = await compile(markdown, config)

  return {
    content: code.replace(/^<script context="module">.*?<\/script>/s, ''),
    metadata: data?.fm || {},
  }
}
