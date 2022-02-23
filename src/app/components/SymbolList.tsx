import React from 'react';
import * as SFSymbol from '../../lib/SFSymbol';
import SymbolView from './SymbolView';

type SymbolListProps = {
    onSelect?: (symbol: SFSymbol.Symbol) => void;
};

async function loadSymbols(): Promise<SFSymbol.Symbol[]> {
    const result = await fetch('http://localhost:7413');
    const txt = await result.text();
    const parsed = JSON.parse(txt);
    return parsed as SFSymbol.Symbol[];
}

const SymbolList = (props: SymbolListProps) => {
    const [symbols, setSymbols] = React.useState([] as SFSymbol.Symbol[]);

    React.useEffect(() => {
        loadSymbols().then(setSymbols);
    }, []);

    const elements = (symbols as SFSymbol.Symbol[]).map((symbol) => {
        return (
            <SymbolView
                key={symbol.name}
                symbol={symbol}
                size={80}
                weight={'Regular'}
                scale={'M'}
                onClick={props.onSelect}
            />
        );
    });
    return (
        <div>
            <p>Select a symbol:</p>
            <div className="symbol-list">{elements}</div>
        </div>
    );
};

export default SymbolList;
