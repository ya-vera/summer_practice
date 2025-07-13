import { Component, createEffect } from 'solid-js';
import * as d3 from 'd3';
import { state } from '../store/traceStore';
import { median, trimmedMinMax } from '../utils/stats';

const BoxplotChart: Component = () => {
    let ref!: SVGSVGElement;

    const drawBoxplot = (
        svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
        data: Float64Array,
        paramName: string,
        width: number,
        height: number,
        margin: { top: number; right: number; bottom: number; left: number }
    ) => {
        const arr = Array.from(data);
        const sorted = [...arr].sort((a, b) => a - b);
        const q1 = d3.quantileSorted(sorted, 0.25)!;
        const q3 = d3.quantileSorted(sorted, 0.75)!;
        const med = median(arr);
        const [trimmedMin, trimmedMax] = trimmedMinMax(arr);
        const iqr = q3 - q1;
        const whiskerMin = Math.max(trimmedMin, q1 - 1.5 * iqr);
        const whiskerMax = Math.min(trimmedMax, q3 + 1.5 * iqr);

        const x = d3.scaleBand<string>()
            .domain([paramName])
            .range([margin.left, width - margin.right])
            .padding(0.1);

        let yDomain: [number, number] = [whiskerMin, whiskerMax];
        const range = whiskerMax - whiskerMin;

        if (range < 0.1) {
            const padding = Math.max(range * 0.1, 0.001);
            yDomain = [whiskerMin - padding, whiskerMax + padding];
        }

        const y = d3.scaleLinear()
            .domain(yDomain)
            .nice()
            .range([height - margin.bottom, margin.top]);

        svg.append('rect')
            .attr('x', x(paramName)!)
            .attr('y', y(q3))
            .attr('width', x.bandwidth())
            .attr('height', Math.max(1, y(q1) - y(q3)))
            .attr('fill', 'steelblue');

        svg.append('line')
            .attr('x1', x(paramName)!)
            .attr('x2', x(paramName)! + x.bandwidth())
            .attr('y1', y(med))
            .attr('y2', y(med))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        svg.append('line')
            .attr('x1', x(paramName)! + x.bandwidth() / 2)
            .attr('x2', x(paramName)! + x.bandwidth() / 2)
            .attr('y1', y(q3))
            .attr('y2', y(whiskerMax))
            .attr('stroke', 'black');

        svg.append('line')
            .attr('x1', x(paramName)! + x.bandwidth() / 2)
            .attr('x2', x(paramName)! + x.bandwidth() / 2)
            .attr('y1', y(q1))
            .attr('y2', y(whiskerMin))
            .attr('stroke', 'black');

        svg.append('line')
            .attr('x1', x(paramName)! + x.bandwidth() / 4)
            .attr('x2', x(paramName)! + (x.bandwidth() * 3) / 4)
            .attr('y1', y(whiskerMax))
            .attr('y2', y(whiskerMax))
            .attr('stroke', 'black');

        svg.append('line')
            .attr('x1', x(paramName)! + x.bandwidth() / 4)
            .attr('x2', x(paramName)! + (x.bandwidth() * 3) / 4)
            .attr('y1', y(whiskerMin))
            .attr('y2', y(whiskerMin))
            .attr('stroke', 'black');

        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        const tickCount = range < 0.1 ? 3 : range < 1 ? 5 : range < 10 ? 8 : 10;
        const tickFormat = range < 0.1 ? d3.format('.4f') : d3.format('.3f');
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(tickCount).tickFormat(tickFormat));
    };

    createEffect(() => {
        const svg = d3.select(ref);
        svg.selectAll('*').remove();

        if (!state.selected.length) {
            svg.append('text')
                .attr('x', 20)
                .attr('y', 20)
                .text('Select parameter');
            return;
        }

        const raw = state.data[state.selected[0]]?.slice(state.burnin) ?? new Float64Array();
        if (raw.length === 0) {
            svg.append('text')
                .attr('x', 20)
                .attr('y', 20)
                .text('No data available');
            return;
        }

        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        drawBoxplot(svg, raw, state.selected[0], width, height, margin);
    });

    return <svg ref={ref} width="600" height="300" />;
};

export default BoxplotChart;