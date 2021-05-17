import { nextElementSibling } from 'extra-dom'

export function nextNthElementSibling<T extends Element>(
  nth: number
): (node: Node) => T | undefined {
  return (node: Node) => nextElementSibling(node, nth) as T | undefined
}
