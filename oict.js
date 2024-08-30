const interpret = (program, word, maxSteps, onDebug) => {    
    // initialize
    const p = parse(program)

    let w = typeof word === 'string' ? word.replaceAll(/[^01]/g, '') : ''
    let pc = 0   // program cyclic counter
                
    const ms = maxSteps > 0 ? maxSteps : 0
    const debug = typeof onDebug === 'function'

    // execute
    let sc = 0   // step counter
    while (w.length && (!ms || sc <= ms)) {
        if (';' === p[pc]) {
            if (debug) onDebug(w, sc)           // debug

        } else {
            sc++ // debug is not an execution step
            
            if (w.startsWith('1')) w += p[pc]   // append
            w = w.substring(1)                  // delete
        }
        
        pc = (pc + 1) % p.length
    }

    if (maxSteps && sc > maxSteps && !debug) throw new Error('Maximal steps exceeded')

    return w
}

// parse the program to AST
function parse(program) {
    const source = program.replaceAll(/[^01;]/g, '')
    const p = []
    let i = 0
    while (i < source.length) {
        if ('1' === source[i]) {
            // parse instruction
            let size = 0
            while ('1' === source[++i]) size++
            if ('0' !== source[i]) error()
            i++     // jump over 0
            if (source.length < i + size) error()
            p.push(source.substring(i, i + size))
            i += size
        }
        else if (';' === source[i]) {
            p.push(';')
            i++
        }
        else error()
    }
    return p

    function error() {
        throw new Error('Syntax error: invalid instruction')
    }
}

module.exports = interpret