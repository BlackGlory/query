import { isElement } from 'extra-dom'

export function followingElementSiblings<T extends Element>(
  predicate: (node: Element, nth: number) => unknown = () => true
): (node: Node) => Iterable<T> {
  return function* (node: Node) {
    let currentNode = node
    let i = 0
    while (true) {
      const siblingNode = currentNode.nextSibling
      if (siblingNode) {
        if (isElement(siblingNode) && predicate(siblingNode, ++i)) {
          yield siblingNode as T
        }
        currentNode = siblingNode
      } else {
        break
      }
    }
  }
}
