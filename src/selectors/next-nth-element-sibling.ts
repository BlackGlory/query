import { nextElementSibling } from 'extra-dom'

export function nextNthElementSibling<T extends Element>(
  nth: number
): (node: Node) => T | null {
  return (node: Node) => nextElementSibling(node, nth) as T | null
}
