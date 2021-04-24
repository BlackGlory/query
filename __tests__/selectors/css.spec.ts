import { css } from '@selectors/css'
import { toArray } from 'iterable-operator'
import { parse } from 'extra-dom'
import 'jest-extended'
import '@blackglory/jest-matchers'

describe('css<T extends Element>(selector: string): (node: Node) => Iterable<T>', () => {
  it('return Function', () => {
    const root = parse(`
      <div>
        <div id="test">
        </div>
      </div>
    `.trim())[0] as Element
    const target = root.querySelector('#test')

    const result = css('#test')(root)
    const arrResult = toArray(result)

    expect(result).toBeIterable()
    expect(arrResult).toEqual([target])
  })
})
