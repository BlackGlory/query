import { nextSibling } from 'extra-dom'

export function nextNthSibling<T extends ChildNode>(
  nth: number
): (node: Node) => T | null {
  return (node: Node) => nextSibling(node, nth) as T | null
}
