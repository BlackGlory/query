import { findInAncestorNodes } from 'extra-dom'

export function ancestor<T extends Node & ParentNode>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | null {
  return (node: Node) => {
    let i = 0
    return findInAncestorNodes(node, node => predicate(node, ++i)) as T | null
  }
}
