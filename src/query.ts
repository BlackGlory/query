type SelectorResult =
| void
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
    let lastRoundResults = parents
    for (const selector of selectors) {
      const results = process(lastRoundResults, selector)
      if (results.size === 0) {
        return []
      } else {
        lastRoundResults = Array.from(results)
      }
    }
    return lastRoundResults
  }

  function process(parents: Element[], selector: Selector): Set<Element> {
    const results = new Set<Element>()
    if (Array.isArray(selector)) {
      for (const sub of selector) {
        const result = process(parents, sub)
        for (const element of result) results.add(element)
      }
    } else {
      for (const parent of parents) {
        const result = Reflect.apply<SelectorResult>(selector, context, [parent])
        if (result === null || result === void 0) {
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

function isIterable<T>(val: any): val is Iterable<T> {
  return val !== null && typeof val[Symbol.iterator] === 'function'
}

function isDocument(value: any): value is Document {
  return isObject(value) && value.nodeType === Node.DOCUMENT_NODE
}

function isObject(value: any): value is { [index: string]: any } {
  return value !== null && typeof value === 'object'
}
