# query

A module for querying elements from pages.

## Install

```sh
npm install --save @blackglory/query
# or
yarn add @blackglory/query
```

## Usage

```ts
import { query, css, xpath } from '@blackglory/query'

const elements = query(
  css`main`
, xpath`.//h2[text()="Title"]`
, xpath`../div`
)
```

## API

```ts
type ISelectorResult =
| null
| undefined
| Node
| Iterable<Node>

type ISelector =
| ((node: Node) => ISelectorResult)
| ((this: Document, node: Node) => ISelectorResult)
| ISelector[]
```

### query

```ts
function query<T extends Node>(
  this: void | Document
, root: Node | Iterable<Node>
, ...selectors: ISelector[]
): T | undefined
function query<T extends Node>(
  this: void | Document
, ...selectors: [ISelector, ...ISelector[]]
): T | undefined
```

### queryAll

```ts
function queryAll<T extends Node>(
  this: void | Document
, root: Node | Iterable<Node>
, ...selectors: ISelector[]
): T[]
function queryAll<T extends Node>(
  this: void | Document
, ...selectors: [ISelector, ...ISelector[]]
): T[]
```

### Selectors

#### css

```ts
function css<T extends Element>(
  strings: TemplateStringsArray
, ...values: string[]
): (node: Node) => Iterable<T>
function css<T extends Element>(
  selector: string
): (node: Node) => Iterable<T>
```

#### xpath

```ts
export function xpath<T extends Node>(
  strings: TemplateStringsArray
, ...values: string[]
): (this: Document, node: Node) => Iterable<T>
export function xpath<T extends Node>(
  expression: string
): (this: Document, node: Node) => Iterable<T>
```

#### ancestor

```ts
function ancestor<T extends Node & ParentNode>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | undefined
```

#### nthAncestor

```ts
function nthAncestor<T extends Node>(nth: number): (node: Node) => T | undefined
```

#### nextSibling

```ts
function nextSibling<T extends ChildNode>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | undefined
```

#### previousSibling

```ts
function previousSibling<T extends ChildNode>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | undefined
```

#### nextNthSibling

```ts
function nextNthSibling<T extends ChildNode>(
  nth: number
): (node: Node) => T | undefined
```

#### previousNthSibling

```ts
function previousNthSibling<T extends ChildNode>(
  nth: number
): (node: Node) => T | undefined
```

#### nextElementSibling

```ts
function nextElementSibling<T extends Element>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | undefined
```

#### previousElementSibling

```ts
function previousElementSibling<T extends Element>(
  predicate: (node: Node, nth: number) => unknown = () => true
): (node: Node) => T | undefined
```

#### nextNthElementSibling

```ts
function nextNthElementSibling<T extends Element>(
  nth: number
): (node: Node) => T | undefined
```

#### previousNthElementSibling

```ts
function previousNthElementSibling<T extends Element>(
  nth: number
): (node: Node) => T | undefined
```

#### followingSiblings

```ts
function followingSiblings<T extends ChildNode>(
  predicate: (node: ChildNode, nth: number) => unknown = () => true
): (node: Node) => Iterable<T>
```

#### precedingSiblings

```ts
function precedingSiblings<T extends ChildNode>(
  predicate: (node: ChildNode, nth: number) => unknown = () => true
): (node: Node) => Iterable<T>
```

#### followingElementSiblings

```ts
function followingElementSiblings<T extends Element>(
  predicate: (node: Element, nth: number) => unknown = () => true
): (node: Node) => Iterable<T>
```

#### precedingElementSibling

```ts
function precedingElementSibling<T extends Element>(
  predicate: (node: Element, nth: number) => unknown = () => true
): (node: Node) => Iterable<T>
```
