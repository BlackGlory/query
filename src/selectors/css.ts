import { concat } from '@utils/concat'
import { isParentNode } from 'extra-dom'

export function css<T extends Element>(
  strings: TemplateStringsArray
, ...values: string[]
): (node: Node) => Iterable<T> {
  const selector = concat(strings, values).join('')
  return node => {
    if (isParentNode(node)) {
      return node.querySelectorAll(selector)
    } else {
      return []
    }
  }
}
