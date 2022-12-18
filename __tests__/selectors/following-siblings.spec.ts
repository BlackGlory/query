import '@test/polyfill'
import { followingSiblings } from '@selectors/following-siblings'
import { parse } from 'extra-dom'
import { toArray } from 'iterable-operator'

describe('followingSiblings(predicate: (node: ChildNode, nth: number) => unknown): (node: Node) => Iterable<T>', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>0</div> 1 <div>2</div>')
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const iter = followingSiblings(predicate)(nodes[0])
      const result = toArray(iter)

      expect(result).toEqual([nodes[2]])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[2], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parse('<div>0</div> 1 <div>2</div>')
      const predicate = jest.fn().mockReturnValue(false)

      const iter = followingSiblings(predicate)(nodes[0])
      const result = toArray(iter)

      expect(result).toEqual([])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[2], 2)
    })
  })
})
