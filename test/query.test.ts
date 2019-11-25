import { query } from '../src/query'

test('query(css, css)', () => {
  document.body.innerHTML = `
    <main>
      <p>target</p>
    </main>
  `
  const res = query('main', ':scope > p')
  expect(res).toEqual([document.querySelector('p')])
})

test('query(css, xpath)', () => {
  document.body.innerHTML = `
    <main>
      <p>target</p>
    </main>
  `
  const res = query('main', '*[text()="target"]')
  expect(res).toEqual([document.querySelector('p')])
})

test('query(css, fn)', () => {
  document.body.innerHTML = `
    <main>
      <p>target</p>
    </main>
  `
  const res = query('main', main => main.children)
  expect(res).toEqual([document.querySelector('p')])
})

test('query(xpath, xpath)', () => {
  document.body.innerHTML = `
    <ul>
      <li>
        <h2>First</h2>
        <p>Hello</p>
      </li>
      <li>
        <h2>Second</h2>
        <p id="target">World</p>
      </li>
    </ul>
  `
  const res = query('//h2[text()="Second"]', '../p')
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(xpath, css)', () => {
  document.body.innerHTML = `
    <ul>
      <li>
        <h2>First</h2>
        <p>Hello</p>
      </li>
      <li>
        <h2>Second</h2>
        <p id="target">World</p>
      </li>
    </ul>
  `
  const res = query('//h2[text()="Second"]/..', ':scope > p')
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(fn, fn)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(
    document => document.querySelector('main')
  , main => main.querySelector(':scope > p')
  )
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(fn, css)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(
    document => document.querySelector('main')
  , ':scope > p'
  )
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(fn, xpath)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(
    document => document.querySelector('main')
  , '*[text()="target"]'
  )
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(element, xpath)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(document.querySelector('main'), '*[text()="target"]')
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(element, css)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(document.querySelector('main'), ':scope > p')
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(element, fn)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(
    document.querySelector('main')
  , main => main.children
  )
  expect(res).toEqual([document.querySelector('#target')])
})

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
  const res = query.call(
    'body'
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
