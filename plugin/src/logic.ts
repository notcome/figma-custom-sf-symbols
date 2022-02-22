export type SymbolWeight = 'Ultralight' | 'Thin' | 'Light' | 'Regular' | 'Medium' | 'Semibold' | 'Bold' | 'Heavy' | 'Black'
export type SymbolScale = 'S' | 'M' | 'L' 
export type SymbolType = {
    weight: SymbolWeight
    scale: SymbolScale
}
export type Hierarchy = 'primary' | 'secondary' | 'tertiary'

export type SymbolVariant = {
    type: SymbolType
    paths: string[]
    width: number
    height: number
}

export type SFSymbol = {
    name: string
    symbols: SymbolVariant[]
    groups?: {
        pathIndices: number[]
        hierarchy?: Hierarchy
    }[]
}

const weights = ['Ultralight', 'Thin', 'Light', 'Regular', 'Medium', 'Semibold', 'Bold', 'Heav', 'Black']
const scales = ['S', 'M', 'L']

export function closestVariant(symbol: SFSymbol, weight: SymbolWeight, scale: SymbolScale): SymbolVariant {
    let variant = symbol.symbols[0]
    let cost = 10000

    const w1 = weights.indexOf(weight)
    const s1 = scales.indexOf(scale)
    for (const candidate of symbol.symbols) {
        const w2 = weights.indexOf(candidate.type.weight)
        const s2 = scales.indexOf(candidate.type.scale)
        const total = Math.abs(w1 - w2) + Math.abs(s1 - s2)

        if (total < cost) {
            cost = total
            variant = candidate
        }
        if (cost == 0) {
            break
        }
    }

    return variant
}
