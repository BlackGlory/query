import '@test/polyfill'
import { precedingElementSiblings } from '@selectors/preceding-element-siblings'
import { parse } from 'extra-dom'
import { toArray } from 'iterable-operator'

describe('precedingElementSiblings(predicate: (node: ChildNode, nth: number) => unknown): (node: Node) => Iterable<T>', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const iter = precedingElementSiblings(predicate)(nodes[4])
      const result = toArray(iter)

      expect(result).toEqual([nodes[0]])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parse('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = jest.fn().mockReturnValue(false)

      const iter = precedingElementSiblings(predicate)(nodes[4])
      const result = toArray(iter)

      expect(result).toEqual([])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })
})
