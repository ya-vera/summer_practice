import { Component, For, JSX } from 'solid-js';
import { mean } from '../utils/stats';
import { ess } from '../utils/ac';
import { state, toggleParam } from '../store/traceStore';

const ParamList: Component = () => {
    const getColor = (ess: number): string => {
        if (ess < 100) {
            return 'text-red-600';
        }
        if (ess < 400) {
            return 'text-orange-600';
        }
        return 'text-green-600';
    };

    const renderParam = (p: string): JSX.Element => {
        const arr = state.data[p]?.slice(state.burnin) ?? [];
        const m = mean(arr).toFixed(2);
        const e = ess(arr);
        const color = getColor(e);

        return (
            <label class="flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={state.selected.includes(p)}
                    onChange={() => toggleParam(p)}
                />
                <span class="ml-2 font-medium">{p}</span>
                <span class={`${color} ml-2`}>ESS={e.toFixed(0)}</span>
                <span class="ml-2">μ={m}</span>
            </label>
        );
    };

    return <For each={state.params}>{renderParam}</For>;
};

export default ParamList;
