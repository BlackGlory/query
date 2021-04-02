import { queryAll } from '@src/query-all'
import { ISelector } from '@src/types'
import { JSDOM } from 'jsdom'

describe('queryAll<T extends Node>(...selectors: ISelector[]): T[]', () => {
  describe('selector returns null', () => {
    it('terminate and return an empty array', () => {
      const selector1 = jest.fn().mockReturnValue(null)
      const selector2 = jest.fn()

      const result = queryAll(selector1, selector2)

      expect(result).toEqual([])
      expect(selector2).not.toBeCalled()
    })
  })

  describe('selector returns undefined', () => {
    it('terminates and returns an empty array', () => {
      const selector1 = jest.fn().mockReturnValue(undefined)
      const selector2 = jest.fn()

      const result = queryAll(selector1, selector2)

      expect(result).toEqual([])
      expect(selector2).not.toBeCalled()
    })
  })

  describe('selector returns Element', () => {
    it('pipes selectors and returns the results', () => {
      const element = document.createElement('div')
      const selector1 = jest.fn().mockReturnValue(element)
      const selector2 = jest.fn().mockReturnValue(element)

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
        const selector1 = jest.fn().mockReturnValue([])
        const selector2 = jest.fn()

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
        const selector1 = jest.fn().mockReturnValue([element1, element2])
        const selector2 = jest.fn().mockReturnValue([element1])

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
      const selector1 = jest.fn().mockReturnValue(element)
      const selector2 = jest.fn().mockReturnValue(null)
      const selector3 = jest.fn().mockReturnValue(element)

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
    const doc = createDocument()
    const selector = jest.fn(setSelf) as ISelector
    let self: unknown

    queryAll.bind(doc)(selector)

    expect(selector).toBeCalledTimes(1)
    expect(selector).toBeCalledWith(doc)
    expect(self).toBe(doc)

    function setSelf(this: unknown) {
      self = this
    }

    function createDocument(): Document {
      const jsdom = new JSDOM()
      const { DOMParser } = jsdom.window
      const parser = new DOMParser()
      const document = parser.parseFromString('', 'text/html')
      return document
    }
  })
})

test('queryAll<T extends Node>(root: Node, ...selectors: ISelector[]): T[]', () => {
  const element1 = document.createElement('div')
  const element2 = document.createElement('div')
  const selector = jest.fn().mockReturnValue(element2)

  const result = queryAll(element1, selector)

  expect(result).toEqual([element2])
  expect(selector).toBeCalledTimes(1)
  expect(selector).toBeCalledWith(element1)
})

test('queryAll<T extends Node>(root: Iterable<Node>, ...selectors: ISelector[]): T[]', () => {
  const element1 = document.createElement('div')
  const element2 = document.createElement('div')
  const element3 = document.createElement('div')
  const selector = jest.fn().mockReturnValue(element3)

  const result = queryAll([element1, element2], selector)

  expect(result).toEqual([element3])
  expect(selector).toBeCalledTimes(2)
  expect(selector).nthCalledWith(1, element1)
  expect(selector).nthCalledWith(2, element2)
})
