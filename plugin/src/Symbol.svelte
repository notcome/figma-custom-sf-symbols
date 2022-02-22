<script lang="ts">
    import { SFSymbol, SymbolWeight, SymbolScale, closestVariant } from './logic'

    export let symbol: SFSymbol
    export let size = 300
    export let weight: SymbolWeight = 'Regular'
    export let scale: SymbolScale = 'M'

    const variant = closestVariant(symbol, weight, scale)
    const logicalSize = 200
    const displayScale = size / logicalSize
    const xOffset = (logicalSize - variant.width) / 2
    const yOffset = logicalSize - (logicalSize - variant.height) / 2

    const rectXY = 10
    const rectWH = logicalSize - rectXY * 2
</script>

<!-- <p style="font-size: 0.8em">{symbol.name}</p> -->
<svg width={size} height={size}>
    <g transform={`scale(${displayScale}, ${displayScale})`}>
        <rect x={rectXY} y={rectXY} width={rectWH} height={rectWH} stroke="black" fill="none" rx="15" ry="15"/>
        <g transform={`translate(${xOffset}, ${yOffset})`}>
            <path d={variant.paths.join(' ')} />
        </g>
    </g>
</svg>
