import { Component, createSignal, createEffect, For } from 'solid-js';

interface ModeChartProps {
    onModeChange?: (mode: 'trace' | 'histogram' | 'boxplot' | 'compare') => void;
}

const ModeChart: Component<ModeChartProps> = (props) => {
    const [mode, setMode] = createSignal<'trace' | 'histogram' | 'boxplot' | 'compare'>('trace');
    const modes = ['trace', 'histogram', 'boxplot', 'compare'] as const;

    createEffect(() => {
        props.onModeChange?.(mode());
    });

    return (
        <div class="p-4">
            <For each={modes}>
                {(m) => (
                    <button
                        class={`px-3 py-1 mr-2 ${mode() === m ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setMode(m)}
                    >
                        {m}
                    </button>
                )}
            </For>
        </div>
    );
};

export default ModeChart;