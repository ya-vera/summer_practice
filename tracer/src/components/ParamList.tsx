import { Component, For } from 'solid-js';
import { mean } from '../utils/stats';
import { ess } from '../utils/ac';
import { state, toggleParam } from '../store/traceStore';

const ParamList: Component = () => {
  return (
    <div class="p-4 space-y-2">
      <For each={state.params}>
        {(p) => {
          const arr = state.data[p]?.slice(state.burnin) ?? [];
          const m = mean(arr).toFixed(2);
          const e = ess(arr);
          const color = e < 100
            ? 'text-red-600'
            : e < 400
              ? 'text-orange-600'
              : 'text-green-600';

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
        }}
      </For>
    </div>
  );
};

export default ParamList;