import { isIterable, isNull, isUndefined } from '@blackglory/types'
import { isDocument } from 'extra-dom'

type SelectorResult =
| null
| undefined
| Element
| Iterable<Element>

type Selector =
| ((parent: Element) => SelectorResult)
| ((this: Document, parent: Element) => SelectorResult)
| Selector[]

export function query<T extends Element>(this: void | Document, ...selectors: Selector[]): T[] {
  const context = isDocument(this) ? this : document

  return pipe([context.documentElement], selectors) as T[]

  function pipe(parents: Element[], selectors: Selector[]): Element[] {
    let results = parents
    for (const selector of selectors) {
      results = Array.from(process(results, selector))
      if (results.length === 0) return []
    }
    return results
  }

  function process(parents: Element[], selector: Selector): Set<Element> {
    const results = new Set<Element>()
    if (Array.isArray(selector)) {
      for (const sub of selector) {
        const result = process(parents, sub)
        for (const element of result) {
          results.add(element)
        }
      }
    } else {
      for (const parent of parents) {
        const result = Reflect.apply<SelectorResult>(selector, context, [parent])
        if (isNull(result) || isUndefined(result)) {
          continue
        } else if (isIterable<Element>(result)) {
          for (const element of result) results.add(element)
        } else {
          results.add(result)
        }
      }
    }
    return results
  }
}
