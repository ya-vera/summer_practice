import { Component } from 'solid-js';
import { mean } from '../utils/stats';
import { ess } from '../utils/ac';
import { state, toggleParam } from '../store/traceStore';

const ParamList: Component<{ mode: 'trace' | 'histogram' | 'boxplot' | 'compare' }> = (props) => {
    const getColor = (essValue: number): string => {
        if (essValue < 100) {
            return 'text-red-600';
        }
        if (essValue < 400) {
            return 'text-orange-600';
        }
        return 'text-green-600';
    };

    const handleCheckboxChange = (param: string) => {
        if (props.mode !== 'compare') {
            toggleParam(param, true);
        } else {
            toggleParam(param, false);
        }
    };

    const renderParam = (p: string) => {
        const arr = state.data[p]?.slice(state.burnin) ?? [];
        const m = mean(arr).toFixed(2);
        const e = ess(arr);
        const color = getColor(e);

        return (
            <label class="flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={state.selected.includes(p)}
                    onChange={() => handleCheckboxChange(p)}
                />
                <span class="ml-2 font-medium">{p}</span>
                <span class={`${color} ml-2`}>ESS={e.toFixed(0)}</span>
                <span class="ml-2">μ={m}</span>
            </label>
        );
    };

    return (
        <div class="p-4 space-y-2">
            <For each={state.params}>
                {renderParam}
            </For>
        </div>
    );
};

export default ParamList;