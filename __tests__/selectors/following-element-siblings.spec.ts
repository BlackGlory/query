import '@test/polyfill'
import { followingElementSiblings } from '@selectors/following-element-siblings'
import { parse } from 'extra-dom'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('followingElementSiblings(predicate: (node: ChildNode, nth: number) => unknown): (node: Node) => Iterable<T>', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const result = followingElementSiblings(predicate)(nodes[0])
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toEqual([nodes[4]])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[4], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parse('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = jest.fn().mockReturnValue(false)

      const result = followingElementSiblings(predicate)(nodes[0])
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toEqual([])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[4], 2)
    })
  })
})
