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
    }
}
