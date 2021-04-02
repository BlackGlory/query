export function ancestor<T extends Node & ParentNode>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | null {
  return (node: Node) => {
    let currentNode = node
    let i = 0
    while (true) {
      const parentNode = currentNode.parentNode
      if (parentNode) {
        if (predicate(parentNode, ++i)) {
          return parentNode as T
        } else {
          currentNode = parentNode
        }
      } else {
        return null
      }
    }
  }
}
