import '@test/polyfill'
import { xpath } from '@selectors/xpath'
import { toArray } from 'iterable-operator'
import { parse } from 'extra-dom'
import { getError } from 'return-style'

describe('xpath(expression: string): (this: Document, node: Node) => Iterable<Node>', () => {
  describe('expression does not starts with dot', () => {
    it('throws a Error', () => {
      const err = getError(() => xpath('//*[@id="test"]'))

      expect(err).toBeInstanceOf(Error)
    })
  })

  it('return Iterable', () => {
    const root = parse(`
      <div>
        <div id="test"></div>
      </div>
    `.trim())[0] as Element
    const target = root.querySelector('#test')

    const iter = xpath('.//*[@id="test"]').call(document, root)
    const result = toArray(iter)

    expect(result).toEqual([target])
  })
})
