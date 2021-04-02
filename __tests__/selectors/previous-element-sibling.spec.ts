import { previousElementSibling } from '@selectors/previous-element-sibling'
import { parse } from 'extra-dom'

describe('previousElementSibling(predicate: (node: Node, nth: number) => unknown): (node: Node) => T | null', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>2</div>.<div>1</div>.<div>0</div>')
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const result = previousElementSibling(predicate)(nodes[4])

      expect(result).toBe(nodes[0])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return null', () => {
      const nodes = parse('<div>2</div>.<div>1</div>.<div>0</div>')
      const predicate = jest.fn().mockReturnValue(false)

      const result = previousElementSibling(predicate)(nodes[4])

      expect(result).toBeNull()
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[0], 2)
    })
  })
})
