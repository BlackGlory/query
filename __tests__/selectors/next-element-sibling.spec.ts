import { nextElementSibling } from '@selectors/next-element-sibling'
import { parse } from 'extra-dom'

describe('nextElementSibling(predicate: (node: Node, nth: number) => unknown): (node: Node) => T | undefined', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const result = nextElementSibling(predicate)(nodes[0])

      expect(result).toBe(nodes[4])
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[4], 2)
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parse('<div>0</div>.<div>1</div>.<div>2</div>')
      const predicate = jest.fn().mockReturnValue(false)

      const result = nextElementSibling(predicate)(nodes[0])

      expect(result).toBeUndefined()
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, nodes[2], 1)
      expect(predicate).nthCalledWith(2, nodes[4], 2)
    })
  })
})
