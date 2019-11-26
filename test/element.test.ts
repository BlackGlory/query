import { query } from '../src/query'

test('query(element, css)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(document.querySelector('main'), ':scope > p')
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

test('query(element, fn)', () => {
  document.body.innerHTML = `
    <main>
      <p id="target">target</p>
    </main>
  `
  const res = query(
    document.querySelector('main')!
  , main => main.children
  )
  expect(res).toEqual([document.querySelector('#target')])
})

test('query(elements, css)', () => {
  document.body.innerHTML = `
    <div>
      <p class="target">target</p>
    </div>
    <div>
      <p class="target">target</p>
    </div>
  `
  const res = query(document.querySelectorAll('div'), ':scope > p')
  expect(res).toEqual([...document.querySelectorAll('.target')])
})

test('query(elements, xpath)', () => {
  document.body.innerHTML = `
    <div>
      <p class="target">target</p>
    </div>
    <div>
      <p class="target">target</p>
    </div>
  `
  const res = query(document.querySelectorAll('div'), '*[text()="target"]')
  expect(res).toEqual([...document.querySelectorAll('.target')])
})

test('query(elements, fn)', () => {
  document.body.innerHTML = `
    <div>
      <p class="target">target</p>
    </div>
    <div>
      <p class="target">target</p>
    </div>
  `
  const res = query(
    document.querySelectorAll('div')
  , div => div.children
  )
  expect(res).toEqual([...document.querySelectorAll('.target')])
})
