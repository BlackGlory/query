import { isIterable, isNull, isUndefined, isFunction } from '@blackglory/types'
import { isDocument } from 'extra-dom'
import { ISelector } from './types'

export function queryAll<T extends Node>(
  this: void | Document
, root: Node | Iterable<Node>
, ...selectors: ISelector[]
): T[]
export function queryAll<T extends Node>(
  this: void | Document
, ...selectors: [ISelector, ...ISelector[]]
): T[]
export function queryAll<T extends Node>(this: void | Document, ...args:
| [root: Node | Iterable<Node>, ...selectors: ISelector[]]
| [...selectors: [ISelector, ...ISelector[]]]
): T[] {
  const context = isDocument(this) ? this : document

  if (isSelector(args[0])) {
    const [selector, ...selectors] = args
    const root = context.documentElement
    const parents = [root]

    return pipe.call(context, parents, selector, ...selectors) as T[]
  } else {
    const [root, ...selectors] = args
    const parents = isIterable(root) ? root: [root]

    return pipe.call(context, parents, ...selectors) as T[]
  }
}

function isSelector(val: unknown): val is ISelector {
  if (isFunction(val)) {
    return true
  } else if (Array.isArray(val)) {
    return val.every(isFunction)
  } else {
    return false
  }
}

function pipe(
  this: Document
, parents: Iterable<Node>
, ...selectors: ISelector[]
): Node[] {
  let results = new Set(parents)

  for (const selector of selectors) {
    results = process.call(this, results, selector)

    if (results.size === 0) break
  }

  return Array.from(results)
}

function process(
  this: Document
, parents: Iterable<Node>
, selector: ISelector
): Set<Node> {
  const results = new Set<Node>()

  if (Array.isArray(selector)) {
    for (const subSelector of selector) {
      const result = process.call(this, parents, subSelector)
      for (const node of result) {
        results.add(node)
      }
    }
  } else {
    for (const parent of parents) {
      const result = selector.call(this, parent)
      if (isNull(result) || isUndefined(result)) {
        continue
      } else if (isIterable(result)) {
        for (const node of result) {
          results.add(node)
        }
      } else {
        results.add(result)
      }
    }
  }

  return results
}
