import { Component, For, createEffect, createSignal } from 'solid-js';
import { mean, median, variance, sd, min, max, trimmedMinMax } from '../utils/stats';
import { ess } from '../utils/ac';
import { state } from '../store/traceStore';

const CompareTable: Component = () => {
    const [rows, setRows] = createSignal<JSX.Element[]>([]);

    const renderRow = (p: string) => {
        const arr = state.data[p]?.slice(state.burnin) ?? [];
        if (arr.length === 0) return null;
        const [tMin, tMax] = trimmedMinMax(arr);
        return (
            <tr>
                <td class="border px-2 py-1">{p}</td>
                <td class="border px-2 py-1">{mean(arr).toFixed(2)}</td>
                <td class="border px-2 py-1">{median(arr).toFixed(2)}</td>
                <td class="border px-2 py-1">{variance(arr).toFixed(2)}</td>
                <td class="border px-2 py-1">{sd(arr).toFixed(2)}</td>
                <td class="border px-2 py-1">{min(arr).toFixed(2)}</td>
                <td class="border px-2 py-1">{max(arr).toFixed(2)}</td>
                <td class="border px-2 py-1">{tMin.toFixed(2)}</td>
                <td class="border px-2 py-1">{tMax.toFixed(2)}</td>
                <td class="border px-2 py-1">{ess(arr).toFixed(0)}</td>
            </tr>
        );
    };

    createEffect(() => {
        const newRows = state.selected.map(p => renderRow(p)).filter(row => row !== null) as JSX.Element[];
        setRows(newRows);
    });

    return (
        <table class="w-full table-auto border-collapse">
            <thead>
                <tr>
                    <th class="border px-2 py-1">Parameter</th>
                    <th class="border px-2 py-1">Mean</th>
                    <th class="border px-2 py-1">Median</th>
                    <th class="border px-2 py-1">Variance</th>
                    <th class="border px-2 py-1">Std Dev</th>
                    <th class="border px-2 py-1">Min</th>
                    <th class="border px-2 py-1">Max</th>
                    <th class="border px-2 py-1">Trimmed Min</th>
                    <th class="border px-2 py-1">Trimmed Max</th>
                    <th class="border px-2 py-1">ESS</th>
                </tr>
            </thead>
            <tbody>
                <For each={rows()}>
                    {row => row}
                </For>
            </tbody>
        </table>
    );
};

export default CompareTable;