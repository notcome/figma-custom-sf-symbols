import React from 'react';
import {Input, ISelectOption, Select, Checkbox, Button, ButtonTypes} from 'figma-react-ui-kit';
import * as SFSymbol from '../../lib/SFSymbol';
import {Configuration, MessageToFigma} from '../../lib/State';
import SymbolView from './SymbolView';

type ConfiguratorProps = {
    symbol: SFSymbol.Symbol;
    configuration: Configuration;
    source?: string;
};

const Configurator = (props: ConfiguratorProps) => {
    const {symbol, configuration} = props;
    const [weight, setWeight] = React.useState(configuration.weight);
    const [scale, setScale] = React.useState(configuration.scale);
    const [pointSize, setPointSize] = React.useState(configuration.pointSize);
    const [showHierarchy, setShowHierarchy] = React.useState(configuration.showHierarchy);

    const weightOptions = SFSymbol.weights
        .filter((x) => {
            for (const variant of symbol.symbols) {
                if (variant.type.weight == x) {
                    return true;
                }
            }
            return false;
        })
        .map((x) => {
            return {
                value: x,
                label: x,
                selected: x == weight,
            };
        });

    const weights = new Set(weightOptions.map((x) => x.value));
    const scaleOptions = SFSymbol.scales
        .filter((x) => {
            for (const variant of symbol.symbols) {
                if (weights.has(variant.type.weight) && variant.type.scale == x) {
                    return true;
                }
            }
            return false;
        })
        .map((x) => {
            return {
                value: x,
                label: x,
                selected: x == scale,
            };
        });

    const handleWeightChange = (option: ISelectOption) => {
        for (const x of weightOptions) {
            if (x.value != option.value) {
                continue;
            }
            setWeight(x.value);
            break;
        }
    };
    const handleScaleChange = (option: ISelectOption) => {
        for (const x of scaleOptions) {
            if (x.value != option.value) {
                continue;
            }
            setScale(x.value);
            break;
        }
    };

    const boundSize = (pointSize / 100) * 200;

    const handlePointSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(event.target.value);
        if (number == NaN) {
            return;
        }
        if (number < 1) {
            return;
        }
        if (number > 100) {
            return;
        }
        setPointSize(number);
    };

    const handleHierarchyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowHierarchy(event.target.checked);
    };

    const handleConfirm = () => {
        const pluginMessage: MessageToFigma = {
            type: 'update-symbol',
            symbol,
            configuration: {
                weight,
                scale,
                pointSize,
                showHierarchy,
            },
            source: props.source,
        };
        parent.postMessage({pluginMessage}, '*');
    };

    const handleCancel = () => {
        const pluginMessage: MessageToFigma = {
            type: 'close-plugin',
        };
        parent.postMessage({pluginMessage}, '*');
    };

    return (
        <div style={{textAlign: 'left', padding: 10}}>
            <SymbolView symbol={symbol} weight={weight} scale={scale} size={boundSize} hierarchy={showHierarchy} />
            <p>Size</p>
            <Input type="number" value={pointSize} onChange={handlePointSizeChange}></Input>
            <p>Weight</p>
            <Select options={weightOptions} onChange={handleWeightChange} value={weight} />
            <p>Scale</p>
            <Select options={scaleOptions} onChange={handleScaleChange} value={scale} />
            <div style={{margin: '12 0'}}>
                <Checkbox label="Use hierarchy." checked={showHierarchy} onChange={handleHierarchyChange} />
            </div>

            <Button buttonType={ButtonTypes.PRIMARY} onClick={handleConfirm}>
                Confirm
            </Button>
            <Button buttonType={ButtonTypes.GHOST} onClick={handleCancel}>
                Cancel
            </Button>
        </div>
    );
};

export default Configurator;
