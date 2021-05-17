import { nextNthElementSibling } from '@selectors/next-nth-element-sibling'
import { parse } from 'extra-dom'

describe('nextNthElementSibling<T extends Element>(nth: number): (node: Node) => T | undefined', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse(`<div>0</div> . <div>1</div> . <div>2</div>`)

      const result = nextNthElementSibling(2)(nodes[0])

      expect(result).toBe(nodes[4])
    })
  })

  describe('sibling does not exist', () => {
    it('return undefined', () => {
      const nodes = parse(`<div>0</div> . <div>1</div> . <div>2</div>`)

      const result = nextNthElementSibling(3)(nodes[0])

      expect(result).toBeUndefined()
    })
  })
})
