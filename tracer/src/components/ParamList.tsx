import { Component } from 'solid-js';
import { mean } from '../utils/stats';
import { ess } from '../utils/ac';
import { state, setState } from '../store/traceStore';

const ParamList: Component = () => {
    return (
        <div class="p-4 space-y-2 overflow-y-auto h-full">
            {state.params.map((param) => {
                const raw = state.data[param].slice(state.burnin);
                const arr = Array.from(raw);
                const m   = mean(arr).toFixed(2);
                const e   = ess(arr);
                const color =
                    e < 100   ? 'text-red-600'
                    : e < 400  ? 'text-orange-600'
                               : 'text-green-600';

                return (
                    <label class="flex items-center cursor-pointer" key={param}>
                        <input
                            type="radio"
                            name="selectedParam"
                            value={param}
                            checked={state.selected[0] === param}
                            onChange={() => setState('selected', [param])}
                            class="form-radio"
                        />
                        <span class="ml-2 font-medium">{param}</span>
                        <span class={`${color} ml-2`}>ESS={e.toFixed(0)}</span>
                        <span class="ml-2">μ={m}</span>
                    </label>
                );
            })}
        </div>
    );
};

export default ParamList;
