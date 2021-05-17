import { previousElementSibling } from 'extra-dom'

export function previousNthElementSibling<T extends Element>(
  nth: number
): (node: Node) => T | undefined {
  return (node: Node) => previousElementSibling(node, nth) as T | undefined
}
