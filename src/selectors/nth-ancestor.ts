export function nthAncestor<T extends Node>(nth: number): (node: Node) => T | null {
  return (node: Node) => {
    let currentNode = node
    for (let i = 1; i <= nth; i++) {
      const parentNode = currentNode.parentNode
      if (parentNode) {
        currentNode = parentNode
      } else {
        return null
      }
    }
    return currentNode as T
  }
}
