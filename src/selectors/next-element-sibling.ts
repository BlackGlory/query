import { findInFollowingSiblingNodes, isElement } from 'extra-dom'

export function nextElementSibling<T extends Element>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | null {
  return (node: Node) => {
    let i = 0
    return findInFollowingSiblingNodes(
      node
    , node => isElement(node)
           && predicate(node, ++i)
    ) as T | null
  }
}
