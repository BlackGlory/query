import { query } from '../src/query'

test('query(null)', () => {
  expect(query(null)).toEqual([])
})

test('query(() => null)', () => {
  expect(query(() => null)).toEqual([])
})

test('query(broken)', () => {
  expect(() => query('~!@#$%^&*()_+')).toThrowError()
})
