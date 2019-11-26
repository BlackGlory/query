declare namespace Reflect {
  function apply<T>(target: (...args: any) => T, thisArgument: any, argumentsList: ArrayLike<any>): T
  function construct<T>(target: new (...args: any) => T, argumentsList: ArrayLike<any>, newTarget?: any): T
}
