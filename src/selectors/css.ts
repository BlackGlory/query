import { concat } from '@utils/concat'
import { isParentNode } from 'extra-dom'
import { isString } from '@blackglory/types'

export function css<T extends Element>(
  selector: string
): (node: Node) => Iterable<T>
export function css<T extends Element>(
  strings: TemplateStringsArray
, ...values: string[]
): (node: Node) => Iterable<T>
export function css<T extends Element>(...args:
| [selector: string]
| [strings: TemplateStringsArray, ...values: string[]]
): (node: Node) => Iterable<T> {
  if (isString(args[0])) {
    const [selector] = args

    return node => {
      if (isParentNode(node)) {
        return node.querySelectorAll(selector)
      } else {
        return []
      }
    }
  } else {
    const [strings, ...values] = args
    const selector = concat(strings, values).join('')

    return css(selector)
  }
}
