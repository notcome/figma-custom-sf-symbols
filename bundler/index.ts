import { JSDOM } from 'jsdom'
import * as fs from 'fs/promises'
import process from 'process'

type TemplateVersion = '2.0' | '3.0'
type SymbolWeight = 'Ultralight' | 'Thin' | 'Light' | 'Regular' | 'Medium' | 'Semibold' | 'Bold' | 'Heavy' | 'Black'
type SymbolScale = 'S' | 'M' | 'L' 
type SymbolType = {
    weight: SymbolWeight
    scale: SymbolScale
}
type Hierarchy = 'primary' | 'secondary' | 'tertiary'

type SymbolVariant = {
    type: SymbolType
    paths: string[]
    width: number
    height: number
}

type SFSymbol = {
    name: string
    symbols: SymbolVariant[]
    groups?: {
        pathIndices: number[]
        hierarchy?: Hierarchy
    }[]
}

const weights: SymbolWeight[] = ['Ultralight', 'Thin', 'Light', 'Regular', 'Medium', 'Semibold', 'Bold', 'Heavy', 'Black']
const scales: SymbolScale[] = ['S', 'M', 'L']

function getSymbolType(type: string): SymbolType | null {
    let weight: SymbolWeight | null
    for (const x of weights) {
        if (type.startsWith(x)) {
            weight = x
            break
        }
    }
    if (!weight) {
        return null
    }
    let scale: SymbolScale | null
    for (const x of scales) {
        if (type.endsWith(x)) {
            scale = x
            break
        }
    }
    if (!scale) {
        return null
    }
    if (`${weight}-${scale}` != type) {
        return null
    }
    return { weight, scale }
}

function getTemplateVersion(dom: JSDOM): TemplateVersion {
    const versionElement = dom.window.document.getElementById('template-version')
    if (!versionElement) {
        throw new Error('Cannot determine the template\'s version.')
    }
    const text = versionElement.textContent
    if (text.includes('2.0')) {
        return '2.0'
    }
    if (text.includes('3.0')) {
        return '3.0'
    }
    throw new Error(`Unknown template version: ${text}`)
}

function getTemplateHeight(dom: JSDOM): number {
    function getY(type: string, scale: SymbolScale): number | null {
        const node = dom.window.document.getElementById(`${type}-${scale}`)
        if (!node) {
            return null
        }
        const y = node.getAttribute('y1')
        if (!y) {
            return null
        }
        const y_ = parseFloat(y)
        if (y_ != NaN) {
            return y_
        }
        return null
    }

    for (const scale of scales) {
        const cap = getY('Capline', scale)
        const base = getY('Baseline', scale)
        if (cap != null && base != null) {
            return base - cap
        }
    }

    throw new Error('Cannot get template symbol height.')
}

function parseSVGPath(data: string): string[] {
    let tokens: string[] = []
    const letter = /^[A-Za-z]/
    const negnum = /^-[0-9]+(\.[0-9])?/
    const posnum = /^[0-9]+(\.[0-9])?/

    let current = data
    while (current.length > 0) {
        if (current[0] == ' ') {
            current = current.substring(1)
            continue
        }
        if (letter.test(current)) {
            tokens.push(current.charAt(0))
            current = current.substring(1)
            continue
        }

        if (negnum.test(current)) {
            const token = negnum.exec(current)[0]
            tokens.push(token)
            current = current.substring(token.length)
            continue
        }

        if (posnum.test(current)) {
            const token = posnum.exec(current)[0]
            tokens.push(token)
            current = current.substring(token.length)
            continue
        }

        throw new Error(`Cannot parse path. Leftover: ${current}`)
    }

    const groups: string[][] = []
    while (tokens.length > 0) {
        const end = tokens.indexOf('Z')
        if (end == -1) {
            throw new Error('Encountered incomplete paths.')
        }
        const rest = tokens.splice(end + 1)
        groups.push(tokens)
        tokens = rest
    }

    return groups.map(xs => xs.join(' '))
}

function getSymbolPaths_V2(symbol: Element): string[] {
    const sum: string[] = []
    for (const path of Array.from(symbol.children)) {
        if (path.nodeName != 'path') {
            continue
        }
        const data = path.getAttribute('d')
        if (typeof data != 'string') {
            continue
        }

        sum.push(...parseSVGPath(data))
    }
    return sum
}

function readTransformOffset(element: Element): [number, number] {
    const transform = element.getAttribute('transform')
    if (typeof transform != 'string') {
        return [0, 0]
    }
    if (!transform.startsWith('matrix(')) {
        throw new Error(`Unexpected transform: ${transform}.`)
    }

    let lparen = transform.indexOf('(')
    let rparen = transform.indexOf(')')
    const numbers = transform.substring(lparen + 1, rparen).split(' ').map(parseFloat)
    if (numbers[0] != 1 || numbers[1] != 0 || numbers[2] != 0 || numbers[3] != 1) {
        throw new Error(`Not an identity matrix: ${transform}.`)
    }

    return [numbers[4], numbers[5]]
}

function getSymbolWidth(symbol: Element, weight: SymbolWeight, dom: JSDOM): number {
    const notesElement = dom.window.document.getElementById('Notes')
    if (!notesElement) {
        throw new Error('Cannot find template notes.')
    }
    let textElement: Element | null = null
    for (const child of Array.from(notesElement.children)) {
        if (child.nodeName != 'text') {
            continue
        }
        if (child.textContent == weight) {
            textElement = child
            break
        }
    }
    if (!textElement) {
        throw new Error(`Cannot find vertical guideline for weight ${weight}.`)
    }

    const midX = readTransformOffset(textElement)[0]
    const leftX = readTransformOffset(symbol)[0]
    return (midX - leftX) * 2
}

async function loadSymbolPaths(path: string): Promise<SymbolVariant[]> {
    const source = await fs.readFile(path, 'utf8')
    const dom = new JSDOM(source)
    const templateVersion = getTemplateVersion(dom)
    const height = getTemplateHeight(dom)

    if (templateVersion != '2.0') {
        throw new Error(`Expects a 2.0 template at ${path}.`)
    }

    const list: SymbolVariant[] = []
    const symbolsElement = dom.window.document.getElementById('Symbols')
    for (const symbol of Array.from(symbolsElement.children)) {
        const type = getSymbolType(symbol.id)
        if (!type) {
            continue
        }
        const paths = getSymbolPaths_V2(symbol)
        const width = getSymbolWidth(symbol, type.weight, dom)

        list.push({
            type,
            paths,
            width,
            height
        })
    }
    return list
}

function getSymbolPaths_V3(symbol: Element): [string[], Hierarchy | null][] {
    const layers: [string[], Hierarchy | null][] = []
    for (const path of Array.from(symbol.children)) {
        if (path.nodeName != 'path') {
            continue
        }
        const data = path.getAttribute('d')
        if (typeof data != 'string') {
            continue
        }

        const paths = parseSVGPath(data)
        let hierarchy: Hierarchy | null
        for (const className of Array.from(path.classList)) {
            if (!className.startsWith('hierarchical')) {
                continue
            }
            if (className.endsWith('primary')) {
                hierarchy = 'primary'
                break
            }
            if (className.endsWith('secondary')) {
                hierarchy = 'secondary'
                break
            }
            if (className.endsWith('tertiary')) {
                hierarchy = 'tertiary'
                break
            }
        }
        layers.push([paths, hierarchy])
    }
    return layers
}


async function loadSymbolHierarchyIntoSymbol(path: string, destination: SFSymbol) {
    const source = await fs.readFile(path, 'utf8')
    const dom = new JSDOM(source)
    const templateVersion = getTemplateVersion(dom)

    if (templateVersion != '3.0') {
        throw new Error(`Expects a 3.0 template at ${path}.`)
    }

    const symbolsElement = dom.window.document.getElementById('Symbols')
    for (const symbol of Array.from(symbolsElement.children)) {
        const type = getSymbolType(symbol.id)
        if (!type) {
            continue
        }

        const index = destination.symbols.findIndex(x => x.type.weight == type.weight && x.type.scale == type.scale)
        if (index == -1) {
            continue
        }

        const templatePaths = destination.symbols[index].paths
        const layers = getSymbolPaths_V3(symbol)
        if (layers.length == 0) {
            break
        }
        const groups = layers.map(([paths, hierarchy]) => {
            const pathIndices = paths.map(path => {
                const index = templatePaths.indexOf(path)
                if (index == -1) {
                    throw new Error('Inconsistent path between 2.0 and 3.0 templates.')
                }
                return index
            })
            return { pathIndices, hierarchy }
        })
        destination.groups = groups

        break
    }
}

async function loadSymbol(name: string, root: string): Promise<SFSymbol> {
    const symbols = await loadSymbolPaths(`${root}/2.0/${name}.svg`)
    if (symbols.length == 0) {
        throw new Error(`No symbol variant found in symbol ${name}.`)
    }

    const symbol = {
        name, 
        symbols
    }
    try {
        loadSymbolHierarchyIntoSymbol(`${root}/3.0/${name}.svg`, symbol)
    } catch(error) {
        console.error(`Failed to load 3.0 template for ${name}.`)
        console.error(error)
    }

    return symbol
}

async function load() {
    const root = `${process.cwd()}/tests/resources`
    const path = root + '/2.0'
    const entries = await fs.readdir(path, { withFileTypes: true })
    const symbols: SFSymbol[] = []

    for (const entry of entries) {
        if (!(entry.isFile && entry.name.endsWith('.svg'))) {
            continue
        }
        console.log(`Reading ${entry.name}...`)
        try {
            const name = entry.name.slice(0, -4)
            const symbol = await loadSymbol(name, root)
            symbols.push(symbol)
            console.log('Done.')
        } catch(error) {
            console.error(`An error occured when loading ${entry.name}:`)
            console.error(error)
        }
    }

    await fs.writeFile('main.json', JSON.stringify(symbols, null, 2))
}

load()
