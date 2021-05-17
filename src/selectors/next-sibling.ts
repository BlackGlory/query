import { findInFollowingSiblingNodes } from 'extra-dom'

export function nextSibling<T extends ChildNode>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | undefined {
  return (node: Node) => {
    let i = 0
    return findInFollowingSiblingNodes(
      node
    , node => predicate(node, ++i)
    ) as T | undefined
  }
}
