import { concat } from '@utils/concat'
import { assert } from '@blackglory/errors'

const UNORDERED_NODE_ITERATOR_TYPE = 'XPathResult' in globalThis
                                   ? XPathResult.UNORDERED_NODE_ITERATOR_TYPE
                                   : 4

export function xpath<T extends Node>(
  strings: TemplateStringsArray
, ...values: string[]
): (this: Document, node: Node) => Iterable<T> {
  const expression = concat(strings, values).join('')
  assert(expression.startsWith('.'), 'XPath expressions must start with "."')

  return function* (this: Document, node: Node) {
    const iterator = this.evaluate(
      expression
    , node
    , null
    , UNORDERED_NODE_ITERATOR_TYPE
    , null
    )

    let value
    while ((value = iterator.iterateNext()) !== null) {
      yield value as T
    }
  }
}
