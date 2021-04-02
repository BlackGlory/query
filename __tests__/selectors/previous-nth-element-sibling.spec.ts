import { previousNthElementSibling } from '@selectors/previous-nth-element-sibling'
import { parse } from 'extra-dom'

describe('previousNthElementSibling<T extends Element>(nth: number): (node: Node) => T | null', () => {
  describe('sibling exists', () => {
    it('return Node', () => {
      const nodes = parse(`<div>2</div> . <div>1</div> . <div>0</div>`)

      const result = previousNthElementSibling(2)(nodes[4])

      expect(result).toBe(nodes[0])
    })
  })

  describe('sibling does not exist', () => {
    it('return null', () => {
      const nodes = parse(`<div>2</div> . <div>1</div> . <div>0</div>`)

      const result = previousNthElementSibling(3)(nodes[4])

      expect(result).toBeNull()
    })
  })
})
