import React from 'react';
import * as SFSymbol from '../../lib/SFSymbol';
import SymbolView from './SymbolView';
import symbols from '../../../bundler/main.json';

type SymbolListProps = {
    onSelect?: (symbol: SFSymbol.Symbol) => void;
};

const SymbolList = (props: SymbolListProps) => {
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
