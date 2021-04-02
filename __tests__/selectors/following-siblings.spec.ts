import { followingSiblings } from '@selectors/following-siblings'
import { parse } from 'extra-dom'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('followingSiblings(predicate: (node: ChildNode, nth: number) => unknown): (node: Node) => Iterable<T>', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>0</div> 1 <div>2</div>')
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const result = followingSiblings(predicate)(nodes[0])
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toEqual([nodes[2]])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[2], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return null', () => {
      const nodes = parse('<div>0</div> 1 <div>2</div>')
      const predicate = jest.fn().mockReturnValue(false)

      const result = followingSiblings(predicate)(nodes[0])
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toEqual([])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[2], 2)
    })
  })
})
