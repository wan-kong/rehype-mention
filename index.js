/**
 * @import {Root, Element, Text} from 'hast'
 */

import { visit } from 'unist-util-visit'

/**
 * A rehype plugin to transform mention text patterns into HTML elements.
 * 
 * Transforms text like:
 * `@[源地址](f14e1cf3-4c94-4427-8ea8-e8ce4b0b8522)`
 * 
 * Into:
 * `<span data-type="mention" data-id="f14e1cf3-4c94-4427-8ea8-e8ce4b0b8522">@源地址</span>`
 * 
 * Also handles mentions that have been converted to links by Markdown processors:
 * `@<a href="uuid">displayText</a>` -> `<span data-type="mention" data-id="uuid">@displayText</span>`
 * 
 * @returns {function(Root): undefined}
 *   Transform function.
 */
export default function rehypeMention() {
    /**
     * @param {Root} tree
     *   Tree.
     * @returns {undefined}
     *   Nothing.
     */
    return function (tree) {
        // 第一遍：处理文本节点中的 mention 模式
        visit(tree, 'text', function (node, index, parent) {
            if (!parent || typeof node.value !== 'string') {
                return
            }

            // 匹配模式: @[显示文本](UUID)
            const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g
            const value = node.value

            // 检查是否包含mention模式
            if (!mentionRegex.test(value)) {
                return
            }

            // 重置regex状态
            mentionRegex.lastIndex = 0

            const children = []
            let lastIndex = 0
            let match

            while ((match = mentionRegex.exec(value)) !== null) {
                const [fullMatch, displayText, uuid] = match
                const matchStart = match.index
                const matchEnd = matchStart + fullMatch.length

                // 添加匹配前的文本
                if (matchStart > lastIndex) {
                    children.push({
                        type: 'text',
                        value: value.slice(lastIndex, matchStart)
                    })
                }

                // 创建mention元素
                children.push({
                    type: 'element',
                    tagName: 'span',
                    properties: {
                        dataType: 'mention',
                        dataId: uuid
                    },
                    children: [{
                        type: 'text',
                        value: `@${displayText}`
                    }]
                })

                lastIndex = matchEnd
            }

            // 添加剩余的文本
            if (lastIndex < value.length) {
                children.push({
                    type: 'text',
                    value: value.slice(lastIndex)
                })
            }

            // 替换当前文本节点
            parent.children.splice(index, 1, ...children)
        })

        // 第二遍：处理被 Markdown 转换成链接的 mention
        // 查找模式: @<a href="uuid">displayText</a>
        visit(tree, 'element', function (node, index, parent) {
            if (!parent || node.tagName !== 'a') {
                return
            }

            // 检查是否有前置的 @ 符号
            const prevSibling = parent.children[index - 1]
            if (!prevSibling || prevSibling.type !== 'text') {
                return
            }

            const textValue = prevSibling.value
            if (!textValue.endsWith('@')) {
                return
            }

            // 获取链接的 href 和文本内容
            const href = node.properties?.href
            const linkText = node.children?.[0]?.value

            if (!href || !linkText) {
                return
            }

            // 移除文本节点末尾的 @
            prevSibling.value = textValue.slice(0, -1)

            // 替换链接为 mention span
            parent.children[index] = {
                type: 'element',
                tagName: 'span',
                properties: {
                    dataType: 'mention',
                    dataId: href
                },
                children: [{
                    type: 'text',
                    value: `@${linkText}`
                }]
            }
        })
    }
}
