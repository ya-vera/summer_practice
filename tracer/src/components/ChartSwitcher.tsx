import { Component, createSignal, For } from 'solid-js';

export const ChartSwitcher: Component<{ onChange: (c: string) => void }> = (props) => {
  const [mode, setMode] = createSignal('trace');
  const list = ['trace', 'histogram', 'boxplot', 'compare'];

  return (
    <div class="p-4">
      <For each={list}>
        {(m) => (
          <button
            class={`px-3 py-1 mr-2 ${mode() === m ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => {
              setMode(m);
              props.onChange(m);
            }}
          >
            {m}
          </button>
        )}
      </For>
    </div>
  );
};