import { ancestor } from '@selectors/ancestor'
import { parse } from 'extra-dom'

describe('ancestor(predicate: (node: Node, nth: number) => unknown): (node: Node) => T | null', () => {
  describe('ancestor exists', () => {
    it('return Node', () => {
      const root = parse(`
        <div>3
          <div id="c">2
            <div></div>
            <div id="b">1
              <div></div>
              <div id="a">0</div>
              <div></div>
            </div>
            <div></div>
          </div>
        </div>
      `.trim())[0] as Element
      const a = root.querySelector('#a')!
      const b = root.querySelector('#b')!
      const c = root.querySelector('#c')!
      const predicate = jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)

      const result = ancestor(predicate)(a)

      expect(result).toBe(c)
      expect(predicate).toBeCalledTimes(2)
      expect(predicate).nthCalledWith(1, b, 1)
      expect(predicate).nthCalledWith(2, c, 2)
    })
  })

  describe('ancestor does not exist', () => {
    it('return null', () => {
      const root = parse(`
        <div>3
          <div id="c">2
            <div></div>
            <div id="b">1
              <div></div>
              <div id="a">0</div>
              <div></div>
            </div>
            <div></div>
          </div>
        </div>
      `.trim())[0] as Element
      const a = root.querySelector('#a')!
      const b = root.querySelector('#b')!
      const c = root.querySelector('#c')!
      const predicate = jest.fn().mockReturnValue(false)

      const result = ancestor(predicate)(a)

      expect(result).toBeNull()
      // `parse` creates a container for `Node[]`,
      // so `predicate` will be called 4 times.
      expect(predicate).toBeCalledTimes(4)
      expect(predicate).nthCalledWith(1, b, 1)
      expect(predicate).nthCalledWith(2, c, 2)
      expect(predicate).nthCalledWith(3, root, 3)
    })
  })
})
