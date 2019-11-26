import { contextEntry, contextInject } from '../src/context'

test('contextEntry -> contextInject', () => {
  const context = { hello: 'world' }
  const main = contextEntry(function (this: typeof context) { return sub() })
  const sub = contextInject(function (this: typeof context) { return this })

  expect(main.call(context)).toBe(context)
})

test('contextEntry -> contextInject -> contextEntry -> contextInject', () => {
  const context = {
    hello: {
      world: true
    }
  }
  const entry = contextEntry(function (this: any) { return [callAnotherEntry(), returnThis()] })
  const callAnotherEntry = contextInject(function (this: any) { return anotherEntry.call(this.hello) })
  const anotherEntry = contextEntry(function (this: any) { return returnThis() })
  const returnThis = contextInject(function (this: any) { return this })

  expect(entry.call(context)).toEqual([{ world: true }, { hello: { world: true }}])
})
