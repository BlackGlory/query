import { describe, it, expect } from 'vitest'
import { previousNthElementSibling } from '@selectors/previous-nth-element-sibling.js'
import { parseNodes } from 'extra-dom'

describe('previousNthElementSibling<T extends Element>(nth: number): (node: Node) => T | undefined', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parseNodes(`<div>2</div> . <div>1</div> . <div>0</div>`)

      const result = previousNthElementSibling(2)(nodes[4])

      expect(result).toBe(nodes[0])
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parseNodes(`<div>2</div> . <div>1</div> . <div>0</div>`)

      const result = previousNthElementSibling(3)(nodes[4])

      expect(result).toBeUndefined()
    })
  })
})
