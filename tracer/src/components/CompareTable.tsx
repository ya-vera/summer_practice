import { Component, createEffect, For, createSignal } from 'solid-js';
import * as d3 from 'd3';
import { mean, median, variance, sd, min, max, trimmedMinMax } from '../utils/stats';
import { ess } from '../utils/ac';
import { state } from '../store/traceStore';

const CompareTable: Component = () => {
    const [rows, setRows] = createSignal<JSX.Element[]>([]);
    let graphRef!: SVGSVGElement;

    const renderRow = (p: string) => {
        const arr = Array.from(state.data[p]?.slice(state.burnin) ?? []);
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

    createEffect(() => {
        const svg = d3.select(graphRef);
        svg.selectAll('*').remove();

        if (!state.selected.length) {
            svg.append('text')
                .attr('x', 20)
                .attr('y', 20)
                .text('Select parameters');
            return;
        }

        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };

        svg.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr('x', margin.left)
            .attr('y', margin.top);

        const maxLength = Math.max(...state.selected.map(p => (state.data[p]?.length ?? 0) - state.burnin));
        const x = d3.scaleLinear()
            .domain([0, maxLength - 1])
            .range([margin.left, width - margin.right]);

        const allData = state.selected.flatMap(p => Array.from(state.data[p]?.slice(state.burnin) ?? []));
        const yMin = d3.min(allData)!;
        const yMax = d3.max(allData)!;
        const y = d3.scaleLinear()
            .domain([yMin, yMax])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const lineGroup = svg.append('g')
            .attr('clip-path', 'url(#clip)');

        const colors = d3.schemeCategory10;
        state.selected.forEach((param, index) => {
            const paramData = Array.from(state.data[param]?.slice(state.burnin) ?? []);
            const line = d3.line<number>()
                .x((_, i) => x(i))
                .y(v => y(v));

            lineGroup.append('path')
                .datum(paramData)
                .attr('fill', 'none')
                .attr('stroke', colors[index % colors.length])
                .attr('stroke-width', 1.5)
                .attr('d', line as any);
        });

        const xAxis = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        const yAxis = svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 10])
            .extent([[margin.left, 0], [width - margin.right, height]])
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                const transform = event.transform;
                const newX = transform.rescaleX(x);
                lineGroup.selectAll('path').attr('d', d => {
                    const updatedLine = d3.line<number>()
                        .x((_, i) => newX(i))
                        .y(v => y(v));
                    return updatedLine(d as number[])!;
                });
                xAxis.call(d3.axisBottom(newX));
            });
        svg.call(zoom);
    });

    return (
        <div>
            <svg ref={graphRef} width="600" height="300" class="mb-4"></svg>
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
        </div>
    );
};

export default CompareTable;