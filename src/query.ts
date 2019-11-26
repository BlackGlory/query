// May replace constant by Prepack in future.

import { contextEntry, contextInject } from './context'

type CSSSelector = string
type XPath = string
type FunctionSelector = (parent: Element) => Iterable<Element> | Element | null
type Selector = Selector[] | CSSSelector | XPath | FunctionSelector

function unique<T>(iterable: Iterable<T>): T[] {
  return [...new Set(iterable)]
}

function isIterable<T>(value: any): value is Iterable<T> {
  return typeof value[Symbol.iterator] === 'function'
}

function isObject(value: any): value is { [index: string]: any } {
  return value !== null && typeof value === 'object'
}

function isElement(value: any): value is Element {
  return isObject(value) && value.nodeType === 1 // Node.ELEMENT_NODE
}

function isDocument(value: any): value is Document {
  return isObject(value) && value.nodeType === 9 // Node.DOCUMENT_NODE
}

// Ugly codes. TS1206 - decorators are not valid on functions.
const queryXPath = contextInject(function* <T extends Element>(this: Document, xpath: string, parent: Element) {
  const iterator = this.evaluate(xpath, parent, null, 4 /* XPathResult.UNORDERED_NODE_ITERATOR_TYPE */, null)
  let value
  while (value = iterator.iterateNext()) {
    yield value as T
  }
})

const queryRound = contextInject((parent: Element, selector: Selector): Element[] => {
  if (Array.isArray(selector)) {
    return unique(selector.flatMap(x => queryRound(parent, x)))
  } else if (selector instanceof Function) {
    const res = selector(parent)
    if (res === null) return []
    if (isElement(res)) return [res]
    return unique(res)
  } else {
    let error
    // CSS Selector
    try {
      const res = parent.querySelectorAll(selector)
      return [...res] // uniqued
    } catch (e) {
      error = e
    }

    // XPath
    try {
      const res = queryXPath(selector, parent)
      return [...res] // uniqued
    } catch (e) {
      error = e
    }

    throw error
  }
})

// Ugly codes. TS1206 - decorators are not valid on functions.
const querySelectorAll = contextEntry(function (this: Document, parents: Element[], selectors: Selector[]) {
  for (const selector of selectors) {
    const nextParents: Element[] = parents.flatMap(parent => queryRound(parent, selector))
    parents = unique(nextParents)
    if (parents.length === 0) return []
  }
  return parents
})

export function query(document: Document, parent: Element | null, ...selectors: Selector[]): Element[]
export function query(document: Document, parents: Iterable<Element>, ...selectors: Selector[]): Element[]
export function query(document: Document, ...selectors: Selector[]): Element[]
export function query(parent: Element | null, ...selectors: Selector[]): Element[]
export function query(parents: Iterable<Element>, ...selectors: Selector[]): Element[]
export function query(...selectors: Selector[]): Element[]
export function query(...args: any[]) {
  let temp: any[]

  const document = isDocument(args[0]) ? args.shift() : globalThis.document
  const parents: Element[] =
    args[0] === null
    ? (args.shift(), [])
    : isIterable<Element>(args[0]) && (temp = [...args[0]]).every(isElement)
      ? (args.shift(), temp)
      : isElement(args[0])
        ? [args.shift()]
        : [document.documentElement]
  const selectors: Selector[] = args
  return Reflect.apply(querySelectorAll, document, [parents, selectors])
}
