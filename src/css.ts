import { concat } from './shared/concat'

export function css<T extends Element>(strings: TemplateStringsArray, ...values: string[]): (parent: ParentNode) => Iterable<T> {
  const selector = concat(strings, values).join('')
  return parent => Array.from(parent.querySelectorAll(selector))
}
