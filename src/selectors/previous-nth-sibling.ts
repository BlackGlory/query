import { previousSibling } from 'extra-dom'

export function previousNthSibling<T extends ChildNode>(
  nth: number
): (node: Node) => T | null {
  return (node: Node) => previousSibling(node, nth) as T | null
}
