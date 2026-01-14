import { describe, it, expect } from 'vitest'
import { previousNthSibling } from '@selectors/previous-nth-sibling.js'
import { parseNodes } from 'extra-dom'

describe('previousNthSibling<T extends ChildNode>(nth: number): (node: Node) => T | undefined', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parseNodes('<div>4</div> 3 <div>2</div> 1 <div>0</div>')

      const result = previousNthSibling(2)(nodes[4])

      expect(result).toBe(nodes[2])
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parseNodes('<div>4</div> 3 <div>2</div> 1 <div>0</div>')

      const result = previousNthSibling(5)(nodes[4])

      expect(result).toBeUndefined()
    })
  })
})
