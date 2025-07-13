import { createStore } from 'solid-js/store';
import type { ColumnMajor } from '../utils/parser';

export interface TraceState {
    data: ColumnMajor;
    params: string[];
    burnin: number;
    selected: string[];
}

export const [state, setState] = createStore<TraceState>({
    data: {},
    params: [],
    burnin: 0,
    selected: [],
});

export function setData(d: ColumnMajor, names: string[]) {
    setState('data', d);
    setState('params', names);
}

export function setBurnin(n: number) {
    setState('burnin', n);
}

export function toggleParam(p: string, singleSelect: boolean) {
    setState('selected', (sel) => {
        if (singleSelect) {
            return sel.includes(p) ? [] : [p];
        }
        return sel.includes(p) ? sel.filter((x) => x !== p) : [...sel, p];
    });
}