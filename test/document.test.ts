import { JSDOM } from 'jsdom'
import { query } from '../src/query'

const jsdom = new JSDOM()
const { DOMParser } = jsdom.window

test('query(document, css)', () => {
  const parser = new DOMParser()
  const document = parser.parseFromString(`
    <main>target</main>
  `, 'text/html')

  const res = query(document, 'main')
  expect(res).toEqual([document.querySelector('main')])
})

test('query(document, xpath)', () => {
  const parser = new DOMParser()
  const document = parser.parseFromString(`
    <main>target</main>
  `, 'text/html')

  const res = query(document, '//main')
  expect(res).toEqual([document.querySelector('main')])
})

test('query(document, fn)', () => {
  const parser = new DOMParser()
  const document = parser.parseFromString(`
    <main>target</main>
  `, 'text/html')

  const res = query(document, document => document.querySelector('main'))
  expect(res).toEqual([document.querySelector('main')])
})
