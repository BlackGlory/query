import { ISelector } from './types'
import { queryAll } from './query-all'

export function query<T extends Node>(
  this: void | Document
, root: Node | Iterable<Node>
, ...selectors: ISelector[]
): T | undefined
export function query<T extends Node>(
  this: void | Document
, ...selectors: [ISelector, ...ISelector[]]
): T | undefined
export function query<T extends Node>(this: void | Document, ...args:
| [root: Node | Iterable<Node>, ...selectors: ISelector[]]
| [...selectors: [ISelector, ...ISelector[]]]
): T | undefined {
  const results = queryAll.apply(this, args as Parameters<typeof queryAll>)
  if (results.length > 0) {
    return results[0] as T
  } else {
    return undefined
  }
}
