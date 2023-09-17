import { compile, defineMDSveXConfig, escapeSvelte } from 'mdsvex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkToc from 'remark-toc'
import shiki from 'shiki'

export async function get_docs_data() {
  const files = import.meta.glob('../../../../../docs/**/!(_)*.md', { as: 'raw' })
  console.log(files)

  return await Promise.all(
    Object.entries(files).map(async ([path, resolver]) => {
      return {
        slug: path.replace('../../../../../docs/', '').replace('.md', ''),
        content: await resolver?.(),
      }
    })
  )
}

const config = defineMDSveXConfig({
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await shiki.getHighlighter({ theme: 'material-theme-darker' })
      return escapeSvelte(highlighter.codeToHtml(code, { lang }))
    },
  },
  remarkPlugins: [[remarkToc, { tight: true }]],
  rehypePlugins: [rehypeSlug, rehypePrettyCode],
})

export async function render_markdown(markdown) {
  return await compile(markdown, config)
}
