import '@test/polyfill'
import { css } from '@selectors/css'
import { toArray } from 'iterable-operator'
import { parse } from 'extra-dom'

describe('css<T extends Element>(selector: string): (node: Node) => Iterable<T>', () => {
  it('return Function', () => {
    const root = parse(`
      <div>
        <div id="test">
        </div>
      </div>
    `.trim())[0] as Element
    const target = root.querySelector('#test')

    const iter = css('#test')(root)
    const result = toArray(iter)

    expect(result).toEqual([target])
  })
})
