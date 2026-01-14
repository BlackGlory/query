import { describe, it, expect, vi } from 'vitest'
import { previousSibling } from '@selectors/previous-sibling.js'
import { parseNodes } from 'extra-dom'

describe('previousSibling(predicate: (node: Node, nth: number) => unknown): (node: Node) => T | undefined', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parseNodes('<div>2</div>1<div>0</div>')
      const predicate = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const result = previousSibling(predicate)(nodes[2])

      expect(result).toBe(nodes[0])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parseNodes('<div>2</div>1<div>0</div>')
      const predicate = vi.fn().mockReturnValue(false)

      const result = previousSibling(predicate)(nodes[2])

      expect(result).toBeUndefined()
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })
})
