export function toArray<T>(iterable: Iterable<T>, count: number = Infinity): T[] {
  const result: T[] =[]
  for (const value of iterable) {
    if (count <= 0) break
    result.push(value)
    count--
  }
  return result
}
