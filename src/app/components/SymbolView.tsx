import * as React from 'react';
import * as SFSymbol from '../../lib/SFSymbol';

type SymbolViewProps = {
    symbol: SFSymbol.Symbol;
    size?: number;
    weight?: SFSymbol.Weight;
    scale?: SFSymbol.Scale;
    hierarchy?: boolean;
    showLabel?: boolean;
    onClick?: (symbol: SFSymbol.Symbol) => void;
};

const SymbolView = (props: SymbolViewProps) => {
    const variant = SFSymbol.closestVariant(props.symbol, props?.weight, props?.scale);
    const logicalSize = 200;
    const displaySize = props?.size ?? logicalSize;

    const scale = displaySize / logicalSize;
    const x = (logicalSize - variant.width) / 2;
    const y = logicalSize - (logicalSize - variant.height) / 2;
    const rectXY = 10;
    const rectWH = logicalSize - rectXY * 2;

    const showLabel = props.showLabel ?? true;
    const hierarchy = props.hierarchy ?? false;

    let paths: JSX.Element[] = [];

    const primary = '#27AAE1';
    const secondary = '#7DCCED';
    const tertiary = '#BEE6F6';

    const groups = props.symbol.groups;
    if (hierarchy && groups) {
        for (const [hierarchy, path] of SFSymbol.getPathsByHierarchy(groups, variant)) {
            let color = primary;
            if (hierarchy == 'secondary') {
                color = secondary;
            }
            if (hierarchy == 'tertiary') {
                color = tertiary;
            }
            paths.push(<path d={path} fill={color} />);
        }
    } else {
        paths.push(<path d={variant.paths.join(' ')} />);
    }

    const handleClick = React.useCallback(() => {
        if (props.onClick) {
            props.onClick(props.symbol);
        }
    }, [props.symbol, props.onClick]);

    return (
        <div className="symbol-view" onClick={handleClick}>
            <svg width={displaySize} height={displaySize}>
                <g transform={`scale(${scale}, ${scale})`}>
                    <rect x={rectXY} y={rectXY} width={rectWH} height={rectWH} stroke="black" fill="none" />
                    <g transform={`translate(${x}, ${y})`}>{paths}</g>
                </g>
            </svg>
            {showLabel && <p className="symbol-name-label">{props.symbol.name}</p>}
        </div>
    );
};

export default SymbolView;
