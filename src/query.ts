// May replace constant by Prepack in future.

// Ugly codes. TS1206 - decorators are not valid on functions.
import { contextEntry, contextInject } from './context'

type CSSSelector = string
type XPath = string
type FunctionSelector = (parent: Element) => Iterable<Element> | Element | null
type Selector = Selector[] | CSSSelector | XPath | FunctionSelector

interface Context {
  document: Document
}

function unique<T>(iterable: Iterable<T>): T[] {
  return [...new Set(iterable)]
}

function isElement(value: any): value is Element {
  return value !== null
  && typeof value === 'object'
  && value.nodeType === 1 // Node.ELEMENT_NODE
}

function isDocument(value: any): value is Document {
  return value !== null
  && typeof value === 'object'
  && value.nodeType === 9 // Node.DOCUMENT_NODE
}

const queryXPath = contextInject(function* <T extends Element>(this: Context, xpath: string, root: Element) {
  const iterator = this.document.evaluate(xpath, root, null, 4 /* XPathResult.UNORDERED_NODE_ITERATOR_TYPE */, null)
  let value
  while (value = iterator.iterateNext()) {
    yield value as T
  }
})

const queryRound = contextInject(function (this: Context, root: Element, selector: Selector): Element[] {
  if (Array.isArray(selector)) {
    return unique(selector.flatMap(x => queryRound(root, x)))
  } else if (selector instanceof Function) {
    const res = selector(root)
    if (res === null) return []
    if (isElement(res)) return [res]
    return unique(res)
  } else {
    let error
    // CSS Selector
    try {
      const res = root.querySelectorAll(selector)
      return [...res] // uniqued
    } catch (e) {
      error = e
    }

    // XPath
    try {
      const res = queryXPath(selector, root)
      return [...res] // uniqued
    } catch (e) {
      error = e
    }

    throw error
  }
})

const querySelectorAll = contextEntry(function (this: Context, parents: Element[], selectors: Selector[]) {
  for (const selector of selectors) {
    const nextParents: Element[] = []
    for (const parent of parents) {
      nextParents.push(...queryRound(parent, selector))
    }
    parents = unique(nextParents)
    if (parents.length === 0) return []
  }
  return parents
})

export function query(root: Element | null, ...selectors: Selector[]): Element[]
export function query(...selectors: Selector[]): Element[]
export function query(this: Context | null, ...args: any[]) {
  if (args[0] === null) return []
  const context = isDocument(this?.document) ? this! : { document }
  const selectors: Selector[] = args[0] instanceof Element ? args.slice(1) : args
  const parents: Element[] = args[0] instanceof Element ? [args[0]] : [context.document.documentElement]
  return Reflect.apply(querySelectorAll, context, [parents, selectors])
}
