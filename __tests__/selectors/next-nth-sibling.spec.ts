import { nextNthSibling } from '@selectors/next-nth-sibling'
import { parse } from 'extra-dom'

describe('nextNthSibling<T extends ChildNode>(nth: number): (node: Node) => T | undefined', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse('<div>0</div> 1 <div>2</div> 3 <div>4</div>')

      const result = nextNthSibling(2)(nodes[0])

      expect(result).toBe(nodes[2])
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parse('<div>0</div> 1 <div>2</div> 3 <div>4</div>')

      const result = nextNthSibling(5)(nodes[0])

      expect(result).toBeUndefined()
    })
  })
})
