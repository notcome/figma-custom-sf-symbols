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

<div on:click>
    <svg width={size} height={size}>
        <g transform={`scale(${displayScale}, ${displayScale})`}>
            <rect x={rectXY} y={rectXY} width={rectWH} height={rectWH} stroke="black" fill="none" rx="15" ry="15"/>
            <g transform={`translate(${xOffset}, ${yOffset})`}>
                <path d={variant.paths.join(' ')} />
            </g>
        </g>
    </svg>
    <p>{symbol.name}</p>
</div>

<style>
    p {
        font-size: 0.8em;
        margin: 0;
        text-align: center;
        overflow-wrap: break-word;
        
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
</style>
