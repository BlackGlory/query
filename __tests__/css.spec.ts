import { css } from '@src/css'
import { toArray } from '@test/utils'
import 'jest-extended'
import '@test/matchers'

describe('function css(strings: TemplateStringsArray, ...values: string[]): (parent: ParentNode) => Iterable<Element>', () => {
  it('return Function', () => {
    document.body.innerHTML = `
      <div id="test"></div>
    `

    const selector = css`#test`
    const result = selector(document)
    const arrResult = toArray(result)

    expect(selector).toBeFunction()
    expect(result).toBeIterable()
    expect(arrResult).toEqual([document.getElementById('test')])
  })
})
