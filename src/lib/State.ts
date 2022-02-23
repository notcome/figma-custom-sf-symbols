import {Symbol, Weight, Scale, scales, closestVariant} from './SFSymbol';

export type Configuration = {
    weight: Weight;
    scale: Scale;
    pointSize: number;
    showHierarchy: boolean;
};

export type State =
    | {
          type: 'browsing';
      }
    | {
          type: 'configuring';
          symbol: Symbol;
          configuration: Configuration;
          source?: string;
      };

export function makeDefaultState(): State {
    return {type: 'browsing'};
}

export function makeDefaultConfiguration(symbol: Symbol): Configuration {
    let {weight, scale} = symbol.symbols[0].type;

    for (const attempt of scales) {
        const result = closestVariant(symbol, 'Regular', attempt);
        if (result.type.weight != 'Regular' || result.type.scale != attempt) {
            continue;
        }
        weight = 'Regular';
        scale = attempt;
        break;
    }

    return {weight, scale, pointSize: 100, showHierarchy: false};
}

export type MessageToFigma =
    | {
          type: 'close-plugin';
      }
    | {
          type: 'update-symbol';
          symbol: Symbol;
          configuration: Configuration;
          source?: string;
      };
