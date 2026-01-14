import { describe, it, expect, vi } from 'vitest'
import { followingElementSiblings } from '@selectors/following-element-siblings.js'
import { parseNodes } from 'extra-dom'
import { toArray } from '@blackglory/prelude'

describe('followingElementSiblings(predicate: (node: ChildNode, nth: number) => unknown): (node: Node) => Iterable<T>', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parseNodes('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const iter = followingElementSiblings(predicate)(nodes[0])
      const result = toArray(iter)

      expect(result).toEqual([nodes[4]])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[4], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parseNodes('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = vi.fn().mockReturnValue(false)

      const iter = followingElementSiblings(predicate)(nodes[0])
      const result = toArray(iter)

      expect(result).toEqual([])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[4], 2)
    })
  })
})
