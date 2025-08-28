import type { Root } from 'hast'

/**
 * A rehype plugin to transform mention text patterns into HTML elements.
 * 
 * Transforms text like:
 * `@[源地址](f14e1cf3-4c94-4427-8ea8-e8ce4b0b8522)`
 * 
 * Into:
 * `<span data-type="mention" data-id="f14e1cf3-4c94-4427-8ea8-e8ce4b0b8522">@源地址</span>`
 */
declare function rehypeMention(): (tree: Root) => void

export default rehypeMention
