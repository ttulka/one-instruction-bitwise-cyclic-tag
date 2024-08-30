# One-Instruction Cyclic Tag

**One-Instruction Cyclic Tag (OICT)** is an esoteric language for programming [cyclic tag systems][cts] using just a single instruction. OICT is inspired by [Bitwise Cyclic Tag][bct] and its alphabet is also composed solely of two symbols: `0` and `1`.

[cts]: https://en.wikipedia.org/wiki/Tag_system#Cyclic_tag_systems
[bct]: https://esolangs.org/wiki/Bitwise_Cyclic_Tag

All symbols other than `0` and `1`, including whitespace, are ignored as comments.

OICT is Turing complete, as it can directly simulate any cyclic tag system, which has been proven to be universal.

## Instruction TAG

The only instruction, TAG, used to define a production takes two arguments and has the following form:

`1`[`1`×*n*]`0`[(`0`|`1`)×*n*)]

Where *n* is a non-negative integer.

- The first argument, represented by the sequence of `1`s following the initial `1`, defines the length of the production.
- The second argument, the sequence of `0`s and `1`s following the first `0` in the instruction, represents the production string.

## Examples

*Whitespaces are added for readability.*

Production (101):
```
1 111 0 101
```

Productions (011, 10, 101):
```
1 111 0 011
1 11 0 10
1 111 0 101
```

Productions (1, ε, 0):
```
1 1 0 1
1 0
1 1 0 0
```

## Debugging

Optionally, an interpreter might implement an additional DEBUG instruction, denoted by `;`, which provides information about the current execution status, such as the current word and the computation step.

DEBUG is not a computation instruction, therefore it won't increase the step counter:

```
;11110011;111010;11110101
```

Outputs (*step: word*)

0: `1`, 1: `011`, 2: `11`, 3: `1101`, 4: `101011`, ...

## JavaScript interpreter

```shell
npm i one-instruction-cyclic-tag
```

```js
const oict = require('one-instruction-cyclic-tag')

// Productions: (011, 10, 101)
oict('11110011;111010;11110101;', // program code
    '1',                          // initial word
     5,                           // max steps
     console.log                  // debug
)
//     "011" 1
//      "11" 2
//    "1101" 3
//  "101011" 4
// "0101110" 5
```

## License

[MIT](LICENSE)