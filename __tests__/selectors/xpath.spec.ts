import { xpath } from '@selectors/xpath'
import { toArray } from '@test/utils'
import 'jest-extended'
import '@blackglory/jest-matchers'

describe('xpath(strings: TemplateStringsArray, ...values: string[]): (this: Document, parent: Node & ParentNode) => Iterable<Element>', () => {
  it('return Function', () => {
    document.body.innerHTML = `
      <div id="test"></div>
    `

    const selector = xpath`//*[@id="test"]`
    const result = selector.bind(document)(document)
    const arrResult = toArray(result)

    expect(selector).toBeFunction()
    expect(result).toBeIterable()
    expect(arrResult).toEqual([document.getElementById('test')])
  })
})
