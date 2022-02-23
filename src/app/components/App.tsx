import * as React from 'react';

import '../styles/ui.css';
import 'figma-react-ui-kit/dist/react.css';
import 'figma-react-ui-kit/dist/style.css';

import SymbolList from './SymbolList';
import * as SFSymbol from '../../lib/SFSymbol';
import * as State from '../../lib/State';
import Configurator from './Configurator';

const App = ({}) => {
    const [state, setState] = React.useState(() => State.makeDefaultState());

    const onSelect = React.useCallback((symbol: SFSymbol.Symbol) => {
        setState({
            type: 'configuring',
            symbol,
            configuration: State.makeDefaultConfiguration(symbol),
        });
    }, []);

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = (event) => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);

    if (state.type == 'browsing') {
        return <SymbolList onSelect={onSelect} />;
    } else {
        return <Configurator symbol={state.symbol} configuration={state.configuration} source={state.source} />;
    }
};

export default App;
