// 此为废弃方案, 仅做存档使用.
// 异步共享context无法实现, 下方的实现并不优于只使用栈的方案.

const register = new Map<Function, any>()
const chain = new Map<Function, Function>()

function getContext(fn: Function): any {
  while (chain.has(fn)) {
    fn = chain.get(fn)!
  }
  return register.get(fn)
}

export function contextInject<T extends any[], U>(fn: (...args: T) => U) {
  return function inject(...args: T): U {
    let caller: any = null
    try {
      caller = inject.caller.caller
    } catch {
      // when inject.caller is a async function, inject.caller.caller will throw TypeError.
    }
    const call = () => Reflect.apply(fn, getContext(caller), args)
    chain.set(call, caller)
    return call()
  }
}

export function contextEntry<T, U extends any[], V>(fn: (...args: U) => V) {
  return function entry(this: T, ...args: U): V {
    const call = () => Reflect.apply(fn, getContext(call), args)
    register.set(call, this)
    try {
      return call()
    } finally {
    }
  }
}

// 异步调用问题:
// 考虑同步函数A调用异步函数B, 异步函数B再调用同步函数C的情况, 预期结果为同步函数C继承异步函数B的上下文.
// 由于函数A是一个同步函数, 在异步函数B调用完毕后不会等待Promise完成就会回收栈里的上下文, 导致异步函数B的上下文被提前回收, 于是同步函数C接收到的是同步函数A的上下文, 不符合预期结果.
// 所以栈不能被用于存在异步函数的情况. 区分同步栈和异步栈同样无法解决上述问题, 这一点已经验证过了.

// 除非能够在每一次函数调用时知道自己的调用路径(非标准属性Function.caller), 否则不可能将context在异步和同步函数之间正确传递. 此外, 即使在知道调用路径的情况下, 也需要一个标识符以标识调用路径的唯一性, 否则在调用路径一致, context不一致的情况下, 无法分辨需要的context.
// 不论调用路径的数据结构是怎样的, 该标识符似乎都无法被埋进entry和inject函数, 连context都首先依赖于标识符, 又如何能够先得到准确的标识符呢?
// 一种容易想到的方案是在函数上存储一个秘密的固定属性, 以此作为标识符. 但此方法并没有解决实际问题, 异步函数内的函数调用可能不是同步的, 在函数被调用时无法相信存储在上一个函数上的固定属性是专为这次函数调用准备的, 在两次函数调用之间, 可能存在着其他的函数调用已经使用了这个固定属性, 于是就会造成混乱.
// 确实存在一种可以部分解决问题的方案: 每次调用包装后的函数时, 都在内部动态创建一个函数副本, 如此函数就可以保证唯一性. 该方案会带来严重的性能损耗, 同时无法还原闭包, 不可取.
// 还有一种方案是翻越两层的Function.caller, 即Function.caller.caller, 只要保证调用被包装函数的函数是唯一的即可. 既然我们已经使用了这个非标准属性, 那么我们当然可以使用它两次, 实验证明这个方案是可行的. 这个方案可能必须限制调用, 或进行更深层次的向上回溯(直到找到已登记的包装方法). 上方的代码是这种方案的实现.
// 此方案衍生出以下问题:
// 1. 被包装函数使用use strict的情况, 是否还可行. 实验结论: 不可行, 如果被包装函数具有use strict, 那么caller值就会变为null.
// 2. 被包装函数之间互相调用的情况, 是否还可行. 实验结论: 不可行, 会构成无限循环.
// 3. 这是先前未预料到的问题. 在异步函数中访问Function.caller.caller, 将触发TypeError:
// TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
// 该问题导致整个有关异步调用的方案无法实施.

// 其他
// 限制调用问题:
// 实现限制只能通过entry和inject包装后的函数调用inject是可行的, 但在实际使用中很容易引入未包装的函数(例如在数组方法上创造临时的箭头函数内调用已被包装过的函数). 豁免箭头函数是一种轻松避免此类情况的方法, 但箭头函数并没有低计算成本的检测方法.
