import { previousSibling } from 'extra-dom'

export function previousNthSibling<T extends ChildNode>(
  nth: number
): (node: Node) => T | undefined {
  return (node: Node) => previousSibling(node, nth) as T | undefined
}
