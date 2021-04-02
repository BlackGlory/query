export type ISelectorResult =
| null
| undefined
| Node
| Iterable<Node>

export type ISelector =
| ((node: Node) => ISelectorResult)
| ((this: Document, node: Node) => ISelectorResult)
| ISelector[]
