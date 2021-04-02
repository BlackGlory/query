import { findInPrecedingSiblingNodes } from 'extra-dom'

export function previousSibling<T extends ChildNode>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | null {
  return (node: Node) => {
    let i = 0
    return findInPrecedingSiblingNodes(node, node => predicate(node, ++i)) as T | null
  }
}
