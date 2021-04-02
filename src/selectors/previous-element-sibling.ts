import { findInPrecedingSiblingNodes, isElement } from 'extra-dom'

export function previousElementSibling<T extends Element>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | null {
  return (node: Node) => {
    let i = 0
    return findInPrecedingSiblingNodes(
      node
    , node => isElement(node)
           && predicate(node, ++i)
    ) as T | null
  }
}
