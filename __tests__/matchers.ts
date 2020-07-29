expect.extend({
  toBeIterable(received: unknown) {
    if (isIterable(received)) {
      return {
        message: () => `expected ${received} not to be a Iterable`
      , pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be a Iterable`
      , pass: false
      }
    }
  }
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeIterable(): R
    }
  }
}

function isIterable<T>(val: any): val is Iterable<T> {
  return val !== null && typeof val[Symbol.iterator] === 'function'
}

export {} // fuck tsc