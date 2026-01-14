import { describe, it, test, expect, vi } from 'vitest'
import { queryAll } from '@src/query-all.js'
import { createDOMParser } from 'extra-dom'

describe('queryAll<T extends Node>(...selectors: ISelector[]): T[]', () => {
  describe('selector returns undefined', () => {
    it('terminate and return an empty array', () => {
      const selector1 = vi.fn().mockReturnValue(undefined)
      const selector2 = vi.fn()

      const result = queryAll(selector1, selector2)

      expect(result).toEqual([])
      expect(selector2).not.toBeCalled()
    })
  })

  describe('selector returns undefined', () => {
    it('terminates and returns an empty array', () => {
      const selector1 = vi.fn().mockReturnValue(undefined)
      const selector2 = vi.fn()

      const result = queryAll(selector1, selector2)

      expect(result).toEqual([])
      expect(selector2).not.toBeCalled()
    })
  })

  describe('selector returns Element', () => {
    it('pipes selectors and returns the results', () => {
      const element = document.createElement('div')
      const selector1 = vi.fn().mockReturnValue(element)
      const selector2 = vi.fn().mockReturnValue(element)

      const result = queryAll(selector1, selector2)

      expect(result).toEqual([element])
      expect(selector1).toBeCalledTimes(1)
      expect(selector1).toBeCalledWith(document)
      expect(selector2).toBeCalledTimes(1)
      expect(selector2).toBeCalledWith(element)
    })
  })

  describe('selector returns Iterable<Node>', () => {
    describe('selector returns empty Iterable<Node>', () => {
      it('terminates and return an empty array', () => {
        const selector1 = vi.fn().mockReturnValue([])
        const selector2 = vi.fn()

        const result = queryAll(selector1, selector2)

        expect(result).toEqual([])
        expect(selector1).toBeCalledTimes(1)
        expect(selector1).toBeCalledWith(document)
        expect(selector2).not.toBeCalled()
      })
    })

    describe('selector returns non-empty Iterable<Node>', () => {
      it('pipe selectors and return the results', () => {
        const element1 = document.createElement('div')
        const element2 = document.createElement('div')
        const selector1 = vi.fn().mockReturnValue([element1, element2])
        const selector2 = vi.fn().mockReturnValue([element1])

        const result = queryAll(selector1, selector2)

        expect(result).toEqual([element1])
        expect(selector1).toBeCalledTimes(1)
        expect(selector1).toBeCalledWith(document)
        expect(selector2).toBeCalledTimes(2)
        expect(selector2).nthCalledWith(1, element1)
        expect(selector2).nthCalledWith(2, element2)
      })
    })
  })

  describe('selector is an array', () => {
    it('pipe sub-selectors and rturn the results', () => {
      const element = document.createElement('div')
      const selector1 = vi.fn().mockReturnValue(element)
      const selector2 = vi.fn().mockReturnValue(undefined)
      const selector3 = vi.fn().mockReturnValue(element)

      const result = queryAll(
        [selector1, selector2]
      , selector3
      )

      expect(result).toEqual([element])
      expect(selector1).toBeCalledTimes(1)
      expect(selector1).toBeCalledWith(document)
      expect(selector2).toBeCalledTimes(1)
      expect(selector2).toBeCalledWith(document)
      expect(selector3).toBeCalledTimes(1)
      expect(selector3).toBeCalledWith(element)
    })
  })

  test('custom context', () => {
    const parser = createDOMParser()
    const doc = parser.parseFromString('', 'text/html')
    // 若使用`vi.fn()`会报错`SecurityError: localStorage is not available for opaque origins`.
    let selectorCalls = 0
    let selectorThis: unknown
    let selectorArgs: unknown[] = []

    queryAll.bind(doc)(
      function (this: unknown, ...args: unknown[]): undefined {
        selectorCalls++
        selectorThis = this
        selectorArgs = args
      }
    )

    expect(selectorCalls).toBe(1)
    expect(selectorThis).toBe(doc)
    expect(selectorArgs).toStrictEqual([doc])
  })
})

test('queryAll<T extends Node>(root: Node, ...selectors: ISelector[]): T[]', () => {
  const element1 = document.createElement('div')
  const element2 = document.createElement('div')
  const selector = vi.fn().mockReturnValue(element2)

  const result = queryAll(element1, selector)

  expect(result).toEqual([element2])
  expect(selector).toBeCalledTimes(1)
  expect(selector).toBeCalledWith(element1)
})

test('queryAll<T extends Node>(root: Iterable<Node>, ...selectors: ISelector[]): T[]', () => {
  const element1 = document.createElement('div')
  const element2 = document.createElement('div')
  const element3 = document.createElement('div')
  const selector = vi.fn().mockReturnValue(element3)

  const result = queryAll([element1, element2], selector)

  expect(result).toEqual([element3])
  expect(selector).toBeCalledTimes(2)
  expect(selector).nthCalledWith(1, element1)
  expect(selector).nthCalledWith(2, element2)
})
