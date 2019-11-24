type CSSSelector = string
type XPath = string
type FunctionSelector = (parent: Element) => Iterable<Element> | Element | null
type Selector = Selector[] | CSSSelector | XPath | FunctionSelector

function unique<T>(iterable: Iterable<T>): T[] {
  return [...new Set(iterable)]
}

function* queryXPath<T extends Element>(document: Document, xpath: string, root: Element) {
  const iterator = document.evaluate(xpath, root, null, XPathResult.ANY_TYPE, null)
  let value
  while (value = iterator.iterateNext()) {
    yield value as T
  }
}

function recursiveQuery(root: Element, selector: Selector): Element[] {
  if (Array.isArray(selector)) {
    return unique(selector.flatMap(x => recursiveQuery(root, x)))
  } else if (selector instanceof Function) {
    const res = selector(root)
    if (res === null) return []
    if (res instanceof Element) return [res]
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
      const res = queryXPath(document, selector, root)
      return [...res] // uniqued
    } catch (e) {
      error = e
    }

    throw error
  }
}

export function query(root: Element | null, ...selectors: Selector[]): Element[]
export function query(...selectors: Selector[]): Element[]
export function query(this: Document, ...args: any[]) {
  if (args[0] === null) return []
  const selectors: Selector[] = args[0] instanceof Element ? args.slice(1) : args
  let parents: Element[] = args[0] instanceof Element ? [args[0]] : [document.documentElement]
  for (const selector of selectors) {
    const nextParents: Element[] = []
    for (const parent of parents) {
      nextParents.push(...recursiveQuery(parent, selector))
    }
    parents = unique(nextParents)
    if (parents.length === 0) return []
  }
  return parents
}
