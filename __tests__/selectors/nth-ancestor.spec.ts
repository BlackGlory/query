import { nthAncestor } from '@selectors/nth-ancestor'
import { parse } from 'extra-dom'

describe('nthAncestor(nth: numberr): (node: Node) => T | null', () => {
  describe('ancestor exists', () => {
    it('returns Node', () => {
      const root = parse(`
        <div>
          <div id="c">
            <div></div>
            <div id="b">
              <div></div>
              <div id="a">
              </div>
              <div></div>
            </div>
            <div></div>
          </div>
        </div>
      `.trim())[0] as Element
      const a = root.querySelector('#a')!
      const c = root.querySelector('#c')!

      const result = nthAncestor(2)(a)

      expect(result).toBe(c)
    })
  })

  describe('ancestor does not exist', () => {
    it('return null', () => {
      const root = parse(`
        <div>
          <div id="c">
            <div></div>
            <div id="b">
              <div></div>
              <div id="a">
              </div>
              <div></div>
            </div>
            <div></div>
          </div>
        </div>
      `.trim())[0] as Element
      const a = root.querySelector('#a')!

      const result = nthAncestor(5)(a)

      expect(result).toBeNull()
    })
  })
})
