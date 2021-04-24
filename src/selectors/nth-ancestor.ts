import { parentNode } from 'extra-dom'

export function nthAncestor<T extends Node>(nth: number): (node: Node) => T | null {
  return (node: Node) => parentNode(node, nth) as T | null
}
