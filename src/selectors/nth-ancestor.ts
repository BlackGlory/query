import { parentNode } from 'extra-dom'

export function nthAncestor<T extends Node>(
  nth: number
): (node: Node) => T | undefined {
  return (node: Node) => parentNode(node, nth) as T | undefined
}
