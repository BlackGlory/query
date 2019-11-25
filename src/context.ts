const stack: any[] = []

export function contextInject<T extends any[], U>(fn: (...args: T) => U) {
  return (...args: T): U => Reflect.apply(fn, stack[stack.length - 1], args)
}

export function contextEntry<T, U extends any[], V>(fn: (...args: U) => V) {
  return function (this: T, ...args: U): V {
    stack.push(this)
    try {
      return Reflect.apply(fn, stack[stack.length - 1], args)
    } finally {
      stack.pop()
    }
  }
}
