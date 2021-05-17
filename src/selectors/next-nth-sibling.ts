import { nextSibling } from 'extra-dom'

export function nextNthSibling<T extends ChildNode>(
  nth: number
): (node: Node) => T | undefined {
  return (node: Node) => nextSibling(node, nth) as T | undefined
}
