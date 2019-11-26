import { query } from '../src/query'

test('query(css, [css, xpath, fn], css)', () => {
  document.body.innerHTML = `
    <div>
      <span>target</span>
    </div>
    <main>
      <p>target</p>
    </main>
    <ul>
      <li>target</li>
    </ul>
  `
  const res = query(
    'body'
  , [
      ':scope > div'
    , './main'
    , body => body.querySelector('ul')
    ]
  , ':scope > *')
  expect(res).toEqual([
    document.querySelector('div > span')
  , document.querySelector('main > p')
  , document.querySelector('ul > li')
  ])
})
