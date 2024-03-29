import { isArray, isIterable, isNull, isUndefined, isFunction } from '@blackglory/prelude'
import { isDocument } from 'extra-dom'
import { ISelector } from './types'
import { pipe } from 'extra-utils'
import { toArray } from 'iterable-operator'

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
    const parents = [context]

    const results = pipe(
      parents
    , (results: Iterable<Document>) => process.call(context, results, selector)
    , ...selectors.map(selector => {
        return (results: Iterable<Node>) => process.call(context, results, selector)
      })
    )

    return toArray(results) as T[]
  } else {
    const [root, ...selectors] = args
    const parents = isIterable(root) ? root: [root]

    const results = pipe(
      parents
    , ...selectors.map(selector => {
        return (results: Iterable<Node>) => process.call(context, results, selector)
      })
    )

    return toArray(results) as T[]
  }
}

function isSelector(val: unknown): val is ISelector {
  if (isFunction(val)) {
    return true
  } else if (isArray(val)) {
    return val.every(isFunction)
  } else {
    return false
  }
}

function process(
  this: Document
, parents: Iterable<Node>
, selector: ISelector
): Set<Node> {
  const results = new Set<Node>()

  if (isArray(selector)) {
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
