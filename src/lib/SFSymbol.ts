export type Weight = 'Ultralight' | 'Thin' | 'Light' | 'Regular' | 'Medium' | 'Semibold' | 'Bold' | 'Heavy' | 'Black';
export type Scale = 'S' | 'M' | 'L';
export type Type = {
    weight: Weight;
    scale: Scale;
};
export type Hierarchy = 'primary' | 'secondary' | 'tertiary';

export type Variant = {
    type: Type;
    paths: string[];
    width: number;
    height: number;
};

type Group = {
    pathIndices: number[];
    hierarchy?: Hierarchy;
};

export type Symbol = {
    name: string;
    symbols: Variant[];
    groups?: Group[];
};

export const weights: Weight[] = [
    'Ultralight',
    'Thin',
    'Light',
    'Regular',
    'Medium',
    'Semibold',
    'Bold',
    'Heavy',
    'Black',
];
export const scales: Scale[] = ['S', 'M', 'L'];

export function closestVariant(symbol: Symbol, weight: Weight, scale: Scale): Variant {
    let variant = symbol.symbols[0];
    let cost = 10000;

    const w1 = weights.indexOf(weight);
    const s1 = scales.indexOf(scale);
    for (const candidate of symbol.symbols) {
        const w2 = weights.indexOf(candidate.type.weight);
        const s2 = scales.indexOf(candidate.type.scale);
        const total = Math.abs(w1 - w2) + Math.abs(s1 - s2);

        if (total < cost) {
            cost = total;
            variant = candidate;
        }
        if (cost == 0) {
            break;
        }
    }

    return variant;
}

export function getPathsByHierarchy(groups: Group[], variant: Variant): [Hierarchy, string][] {
    const list: [Hierarchy, string][] = [];
    for (const group of groups) {
        const path = group.pathIndices.map((i) => variant.paths[i]).join(' ');
        const hierarchy = group.hierarchy ?? 'primary';
        const index = list.findIndex((x) => x[0] == hierarchy);
        if (index == -1) {
            list.push([hierarchy, path]);
            continue;
        }
        list[index][1] += ' ' + path;
    }
    return list;
}
