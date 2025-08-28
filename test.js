/**
 * Test for rehype-mention plugin
 */

import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import rehypeMention from './index.js'

// 测试用例
const testCases = [
    {
        name: '基本mention转换',
        input: '<p>这是一个@[源地址](f14e1cf3-4c94-4427-8ea8-e8ce4b0b8522)测试。</p>',
        expected: '<p>这是一个<span data-type="mention" data-id="f14e1cf3-4c94-4427-8ea8-e8ce4b0b8522">@源地址</span>测试。</p>'
    },
    {
        name: '多个mention',
        input: '<p>用户@[张三](user-123)和@[李四](user-456)在讨论。</p>',
        expected: '<p>用户<span data-type="mention" data-id="user-123">@张三</span>和<span data-type="mention" data-id="user-456">@李四</span>在讨论。</p>'
    },
    {
        name: '无mention的文本',
        input: '<p>这是普通文本，没有mention。</p>',
        expected: '<p>这是普通文本，没有mention。</p>'
    },
    {
        name: '包含特殊字符的mention',
        input: '<p>系统@[服务器-01：10.0.0.1](srv-a1b2c3d4-e5f6-7890-abcd-ef1234567890)状态正常。</p>',
        expected: '<p>系统<span data-type="mention" data-id="srv-a1b2c3d4-e5f6-7890-abcd-ef1234567890">@服务器-01：10.0.0.1</span>状态正常。</p>'
    }
]

async function runTests() {
    console.log('🧪 运行 rehype-mention 插件测试...\n')

    let passed = 0
    let failed = 0

    for (const testCase of testCases) {
        try {
            const result = await unified()
                .use(rehypeParse, { fragment: true })
                .use(rehypeMention)
                .use(rehypeStringify)
                .process(testCase.input)

            const output = String(result).trim()

            if (output === testCase.expected) {
                console.log(`✅ ${testCase.name}`)
                passed++
            } else {
                console.log(`❌ ${testCase.name}`)
                console.log(`   期望: ${testCase.expected}`)
                console.log(`   实际: ${output}`)
                failed++
            }
        } catch (error) {
            console.log(`💥 ${testCase.name} - 执行错误:`, error.message)
            failed++
        }
        console.log()
    }

    console.log(`\n📊 测试结果: ${passed} 通过, ${failed} 失败`)

    if (failed === 0) {
        console.log('🎉 所有测试通过！')
    } else {
        console.log('❗ 有测试失败，请检查实现。')
        process.exit(1)
    }
}

runTests().catch(console.error)
