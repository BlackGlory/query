import { query } from '@src/query'
import { JSDOM } from 'jsdom'

describe('query(...selectors: Selector[]): Element[]', () => {
  describe('selector returns null or undefined', () => {
    describe('selector returns null', () => {
      it('terminate and return empty array', () => {
        const selector1 = jest.fn().mockReturnValue(null)
        const selector2 = jest.fn()

        const result = query(selector1, selector2)

        expect(result).toEqual([])
        expect(selector2).not.toBeCalled()
      })
    })

    describe('selector returns undefined', () => {
      it('terminate and return empty array', () => {
        const selector1 = jest.fn().mockReturnValue(undefined)
        const selector2 = jest.fn()

        const result = query(selector1, selector2)

        expect(result).toEqual([])
        expect(selector2).not.toBeCalled()
      })
    })
  })

  describe('selector returns Element or Iterable<Element>', () => {
    describe('selector returns Element', () => {
      it('receive and pass result to next selector', () => {
        const element = document.createElement('div')
        const selector1 = jest.fn().mockReturnValue(element)
        const selector2 = jest.fn().mockReturnValue(element)

        const result = query(selector1, selector2)

        expect(result).toEqual([element])
        expect(selector1).toBeCalledTimes(1)
        expect(selector1).toBeCalledWith(document.documentElement)
        expect(selector2).toBeCalledTimes(1)
        expect(selector2).toBeCalledWith(element)
      })
    })

    describe('selector returns Iterable<Element>', () => {
      describe('selector returns empty Iterable<Element>', () => {
        it('stop and return empty array', () => {
          const selector1 = jest.fn().mockReturnValue([])
          const selector2 = jest.fn()

          const result = query(selector1, selector2)

          expect(result).toEqual([])
          expect(selector1).toBeCalledTimes(1)
          expect(selector1).toBeCalledWith(document.documentElement)
          expect(selector2).not.toBeCalled()
        })
      })

      describe('selector returns non-empty Iterable<Element>', () => {
        it('receive and pass result to next selector', () => {
          const element1 = document.createElement('div')
          const element2 = document.createElement('div')
          const selector1 = jest.fn().mockReturnValue([element1, element2])
          const selector2 = jest.fn().mockReturnValue([element1])

          const result = query(selector1, selector2)

          expect(result).toEqual([element1])
          expect(selector1).toBeCalledTimes(1)
          expect(selector1).toBeCalledWith(document.documentElement)
          expect(selector2).toBeCalledTimes(2)
          expect(selector2).nthCalledWith(1, element1)
          expect(selector2).nthCalledWith(2, element2)
        })
      })
    })
  })

  describe('selector groups', () => {
    it('receive and pass result to next selector', () => {
      const element = document.createElement('div')
      const selector1 = jest.fn().mockReturnValue(element)
      const selector2 = jest.fn().mockReturnValue(null)
      const selector3 = jest.fn().mockReturnValue(element)

      const result = query(
        [selector1, selector2]
      , selector3
      )

      expect(result).toEqual([element])
      expect(selector1).toBeCalledTimes(1)
      expect(selector1).toBeCalledWith(document.documentElement)
      expect(selector2).toBeCalledTimes(1)
      expect(selector2).toBeCalledWith(document.documentElement)
      expect(selector3).toBeCalledTimes(1)
      expect(selector3).toBeCalledWith(element)
    })
  })

  describe('context', () => {
    describe('binding', () => {
      it('use binding context', () => {
        const doc = createDocument()
        const selector = jest.fn(setInsideThis)
        let insideThis: unknown

        query.bind(doc)(selector)

        expect(selector).toBeCalledTimes(1)
        expect(selector).toBeCalledWith(doc.documentElement)
        expect(insideThis).toBe(doc)

        function setInsideThis(this: unknown) {
          insideThis = this
        }
      })
    })

    describe('non-binding', () => {
      it('use document as context', () => {
        const selector = jest.fn(setInsideThis)
        let insideThis: unknown

        query(selector)

        expect(selector).toBeCalledTimes(1)
        expect(selector).toBeCalledWith(document.documentElement)
        expect(insideThis).toBe(document)

        function setInsideThis(this: unknown) {
          insideThis = this
        }
      })
    })
  })
})

function createDocument(): Document {
  const jsdom = new JSDOM()
  const { DOMParser } = jsdom.window
  const parser = new DOMParser()
  const document = parser.parseFromString('', 'text/html')
  return document
}
