import '@test/polyfill'
import { precedingSiblings } from '@selectors/preceding-siblings'
import { parse } from 'extra-dom'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('precedingSiblings(predicate: (node: ChildNode, nth: number) => unknown): (node: Node) => Iterable<T>', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>2</div> 1 <div>0</div>')
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const result = precedingSiblings(predicate)(nodes[2])
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toEqual([nodes[0]])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parse('<div>2</div> 1 <div>0</div>')
      const predicate = jest.fn().mockReturnValue(false)

      const result = precedingSiblings(predicate)(nodes[2])
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toEqual([])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[1], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })
})
