export function concat(strings: TemplateStringsArray, values: string[]): string[] {
  const result = []
  for (let i = 0, len = values.length; i < len; i++) {
    result.push(strings[i])
    result.push(values[i])
  }
  result.push(strings[strings.length - 1])
  return result
}
