export function followingSiblings<T extends ChildNode>(
  predicate: (node: ChildNode, nth: number) => unknown = () => true
): (node: Node) => Iterable<T> {
  return function* (node: Node) {
    let currentNode = node
    let i = 0
    while (true) {
      const siblingNode = currentNode.nextSibling
      if (siblingNode) {
        if (predicate(siblingNode, ++i)) {
          yield siblingNode as T
        }
        currentNode = siblingNode
      } else {
        break
      }
    }
  }
}
