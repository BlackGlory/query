import { describe, it, expect } from 'vitest'
import { css } from '@selectors/css.js'
import { toArray } from '@blackglory/prelude'
import { parseNodes } from 'extra-dom'

describe('css<T extends Element>(selector: string): (node: Node) => Iterable<T>', () => {
  it('return Function', () => {
    const root = parseNodes(`
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
