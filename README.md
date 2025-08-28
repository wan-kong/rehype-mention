# rehype-mention

A [rehype](https://github.com/rehypejs/rehype) plugin to transform mention text patterns into HTML elements.

## What is this?

This package is a plugin that transforms mention-style text patterns into structured HTML elements with semantic data attributes.

## When should I use this?

Use this plugin when you need to convert text-based mentions (like `@[displayText](data)`) into proper HTML elements for rich text editing or display purposes.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 16+), install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install rehype-mention
```

## Use

### Basic HTML Processing

Say our module contains:

```js
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'
import rehypeMention from 'rehype-mention'

const file = await unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeMention)
  .use(rehypeStringify)
  .process('<p>这是一个@[张三](xiaoming)测试。</p>')

console.log(String(file))
```

…then running the code will output:

```html
<p>这是一个<span data-type="mention" data-id="xiaoming">@张三</span>测试。</p>
```

### Markdown Integration

**⚠️ Important:** In Markdown environments, `@[text](id)` patterns will be converted to links by Markdown parsers. This plugin handles both scenarios:

```js
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import {unified} from 'unified'
import rehypeMention from 'rehype-mention'

// Process Markdown with mentions
const result = await unified()
  .use(remarkParse)          // Parse Markdown
  .use(remarkRehype)         // Convert to HTML AST
  .use(rehypeMention)        // Handle mentions (works after link conversion)
  .use(rehypeStringify)      // Output HTML
  .process('User @[张三](user-123) sent a message.')

console.log(String(result))
// Output: <p>User <span data-type="mention" data-id="user-123">@张三</span> sent a message.</p>
```

## API

This package exports no identifiers.
The default export is `rehypeMention`.

### `unified().use(rehypeMention)`

Transform mention text patterns into HTML elements.

The plugin searches for text patterns in two formats:

1. **Text format:** `@[displayText](uuid)`
2. **Link format:** `@<a href="uuid">displayText</a>` (from Markdown conversion)

Both are transformed into:

```html
<span data-type="mention" data-id="uuid">@displayText</span>
```

#### Processing Order

This plugin is designed to work **after** Markdown processing. The recommended order is:

1. `remarkParse` (if using Markdown)
2. `remarkRehype` (if using Markdown)
3. **`rehypeMention`** ← Insert here
4. `rehypeStringify`

#### Parameters

This plugin takes no parameters.

#### Returns

Transform function ([`Transformer`](https://github.com/unifiedjs/unified#transformer)).

## Pattern Format

The plugin recognizes mention patterns with the following structure:

- Starts with `@`
- Followed by `[displayText]`
- Followed by `(uuid)`

Where:

- `displayText`: The text to display (will be prefixed with `@`)
- `uuid`: The unique identifier that becomes the `data-id` attribute

## Examples

### Basic mention (Text format)

```html
<!-- Input -->
<p>Contact @[admin](admin-123) for help.</p>

<!-- Output -->
<p>Contact <span data-type="mention" data-id="admin-123">@admin</span> for help.</p>
```

### Multiple mentions

```html
<!-- Input -->
<p>Meeting with @[张三](user-1) and @[李四](user-2)</p>

<!-- Output -->
<p>Meeting with <span data-type="mention" data-id="user-1">@张三</span> and <span data-type="mention" data-id="user-2">@李四</span></p>
```

### Markdown-converted mentions (Link format)

```html
<!-- Input (after Markdown processing) -->
<p>User @<a href="user-123">张三</a> sent a message.</p>

<!-- Output -->
<p>User <span data-type="mention" data-id="user-123">@张三</span> sent a message.</p>
```

### Mixed scenario

```html
<!-- Input -->
<p>@[源地址](f14e1cf3)和@<a href="user-123">张三</a>都在线。</p>

<!-- Output -->
<p><span data-type="mention" data-id="f14e1cf3">@源地址</span>和<span data-type="mention" data-id="user-123">@张三</span>都在线。</p>
```

## Compatibility

This package works with Node.js 16+.
This package works with `rehype` version 13+.

## Security

This plugin does not sanitize input. Always use proper sanitization when dealing with user-generated content.

## License

MIT
