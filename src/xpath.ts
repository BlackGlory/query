import { concat } from './shared/concat'

export function xpath<T extends Element>(strings: TemplateStringsArray, ...values: string[]): (this: Document, parent: Node) => Iterable<T> {
  const expression = concat(strings, values).join('')

  return function* (this: Document, parent: Node) {
    const iterator = this.evaluate(expression, parent, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
    let value
    while ((value = iterator.iterateNext()) !== null) {
      yield value as T
    }
  }
}
