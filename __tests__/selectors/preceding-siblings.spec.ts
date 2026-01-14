import { describe, it, expect, vi } from 'vitest'
import { precedingSiblings } from '@selectors/preceding-siblings.js'
import { parseNodes } from 'extra-dom'
import { toArray } from '@blackglory/prelude'

describe('precedingSiblings(predicate: (node: ChildNode, nth: number) => unknown): (node: Node) => Iterable<T>', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parseNodes('<div>2</div> 1 <div>0</div>')
      const predicate = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const iter = precedingSiblings(predicate)(nodes[2])
      const result = toArray(iter)

      expect(result).toEqual([nodes[0]])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parseNodes('<div>2</div> 1 <div>0</div>')
      const predicate = vi.fn().mockReturnValue(false)

      const iter = precedingSiblings(predicate)(nodes[2])
      const result = toArray(iter)

      expect(result).toEqual([])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })
})
