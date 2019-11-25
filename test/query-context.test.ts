import { JSDOM } from 'jsdom'
import { query } from '../src/query'

const jsdom = new JSDOM()
const { DOMParser } = jsdom.window

test('query.call(context, css, [css, xpath, fn], css) in jsdom', () => {
  const parser = new DOMParser()
  const document = parser.parseFromString(`
    <div>
      <span>target</span>
    </div>
    <main>
      <p>target</p>
    </main>
    <ul>
      <li>target</li>
    </ul>
  `, 'text/html')

  const res = query.call(
    { document }
  , 'body'
  , [
      'div'
    , '//main'
    , body => body.querySelector('ul')
    ]
  , ':scope > *')
  expect(res).toEqual([
    document.querySelector('div > span')
  , document.querySelector('main > p')
  , document.querySelector('ul > li')
  ])
})

test('query.call(null, css, [css, xpath, fn], css) in jsdom', () => {
  const parser = new DOMParser()
  const document = parser.parseFromString(`
    <div>
      <span>target</span>
    </div>
    <main>
      <p>target</p>
    </main>
    <ul>
      <li>target</li>
    </ul>
  `, 'text/html')

  const res = query.call(
    null
  , 'body'
  , [
      'div'
    , '//main'
    , body => body.querySelector('ul')
    ]
  , ':scope > *')
  expect(res).toEqual([])
})
