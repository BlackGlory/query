import '@test/polyfill'
import { query, css, xpath } from '@src/index'

test('css', () => {
  document.body.innerHTML = `
    <div id="test"></div>
  `

  const result = query(
    css`div`
  )

  expect(result).toEqual(document.getElementById('test'))
})

test('xpath', () => {
  document.body.innerHTML = `
    <h2>Test</h2>
    <p id="test">World</p>
  `

  const result = query(
    xpath`.//h2[text()="Test"]`
  , xpath`../p`
  )

  expect(result).toEqual(document.getElementById('test'))
})
