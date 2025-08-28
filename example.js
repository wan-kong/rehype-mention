/**
 * Example usage of rehype-mention plugin
 */

import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import rehypeMention from './index.js'

const examples = [
    '<p>这是一个@[源地址](f14e1cf3-4c94-4427-8ea8-e8ce4b0b8522)测试。</p>',
    '<p>用户@[张三](user-123)和@[李四](user-456)在讨论。</p>',
    '<div>系统@[服务器-01：10.0.0.1](srv-a1b2c3d4-e5f6-7890-abcd-ef1234567890)状态正常。</div>'
]

console.log('🚀 rehype-mention 插件示例\n')

for (let i = 0; i < examples.length; i++) {
    const input = examples[i]

    const result = await unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeMention)
        .use(rehypeStringify)
        .process(input)

    console.log(`示例 ${i + 1}:`)
    console.log(`输入: ${input}`)
    console.log(`输出: ${String(result)}`)
    console.log()
}
