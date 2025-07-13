import { Component, createSignal, createEffect } from 'solid-js';

interface ModeChartProps {
    onModeChange?: (mode: 'trace' | 'histogram' | 'boxplot' | 'compare') => void;
}

const ModeChart: Component<ModeChartProps> = (props) => {
    const [mode, setMode] = createSignal<'trace' | 'histogram' | 'boxplot' | 'compare'>('trace');

    createEffect(() => {
        props.onModeChange?.(mode());
    });

    return (
        <div class="p-4">
            {['trace', 'histogram', 'boxplot', 'compare'].map((m) => (
                <button
                    key={m}
                    class={`px-3 py-1 mr-2 ${mode() === m ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setMode(m as any)}
                >
                    {m}
                </button>
            ))}
        </div>
    );
};

export default ModeChart;