const oict = require('./oict')

test('error: invalid syntax', () => {
  expect(() => oict('0')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('101')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('010')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('100')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('11001')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('11000')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('110')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('11101')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('1011101')).toThrow('Syntax error: invalid instruction')
  expect(() => oict('110111101')).toThrow('Syntax error: invalid instruction')
})

test('debug', () => {
  const word = [], step = []
  const onDebug = (w, s) => {
    word.push(w)
    step.push(s)
  }
  // Productions: (10, 00, 01)
  oict('111010; 111000; 111010;', '1', 100, onDebug)
  expect(word).toStrictEqual(['10', '000', '00', '0'])
  expect(step).toStrictEqual([1, 2, 3, 4])
})

test('debug #2', () => {
  const word = [], step = []
  const onDebug = (w, s) => {
    word.push(w)
    step.push(s)
  }
  // Productions: (011, 10, 101)
  oict(';11110011;111010;11110101', '1', 6, onDebug)
  expect(word).toStrictEqual(['1', '011', '11', '1101', '101011', '0101110', '101110'])
  expect(step).toStrictEqual([0, 1, 2, 3, 4, 5, 6])
})

test('empty program', () => {
  expect(oict('')).toEqual('')
  expect(oict('', '0')).toEqual('')
  expect(oict('', '1')).toEqual('')
})

test('empty string', () => {
  expect(oict('10', '1')).toEqual('')
  expect(oict('10', '111')).toEqual('')
  expect(oict('1010', '1')).toEqual('')
  expect(oict('1010', '111')).toEqual('')
})

test('infinite loop', () => {
  // Productions: (1)
  expect(() => oict('1101', '1', 100)).toThrow('Maximal steps exceeded')
  // Productions: (01)
  expect(() => oict('111001', '1', 100)).toThrow('Maximal steps exceeded')
  // Productions: (1, 01)
  expect(() => oict('1101 111001', '1', 100)).toThrow('Maximal steps exceeded')
})

test('(011, 10, 101)', () => {
  const results = []
  oict(';11110011 ;111010 ;11110101', '1', 6, w => results.push(w))
  expect(results).toStrictEqual(['1', '011', '11', '1101', '101011', '0101110', '101110'])
})

test('(011, 10, 101) #2', () => {
  const results = []
  oict('11110011; 111010; 11110101;', '1', 5, w => results.push(w))
  expect(results).toStrictEqual(['011', '11', '1101', '101011', '0101110'])
})

test('(010, 000, 1111)', () => {
  const results = []
  oict(';11110010 ;11110000 ;1111101111', '11001', 6, w => results.push(w))
  expect(results).toStrictEqual(['11001', '1001010', '001010000', '01010000', '1010000', '010000000', '10000000'])
})

test('Hello World', () => {
  const alphabet = []
  alphabet['000'] = ' '
  alphabet['001'] = 'd'
  alphabet['010'] = 'e'
  alphabet['011'] = 'H'
  alphabet['100'] = 'l'
  alphabet['101'] = 'o'
  alphabet['110'] = 'r'
  alphabet['111'] = 'W'

  let result = ''
  oict(`
      1 111111111111111111111111111111111 0                                 33 symbols
      H 011 e 010 l 100 l 100 o 101 000 W 111 o 101 r 110 l 100 d 001 ;     Hello World
      101010101010101010101010101010101010101010101010101010101010101010    delete (empty string) 33 times
  `, '1', null, w => result = w)

  let msg = ''
  for (let i = 0; i < result.length; i += 3) {
      const c = result.substring(i, i + 3)
      msg += alphabet[c]
  }

  expect(msg).toEqual('Hello World')
})