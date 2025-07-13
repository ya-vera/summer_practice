import { Component, onMount } from 'solid-js';
import * as d3 from 'd3';
import { state } from '../store/traceStore';

const TraceChart: Component = () => {
    let ref!: SVGSVGElement;
    const { selected, data, burnin } = state;
    onMount(() => {
        const svg = d3.select(ref);
        svg.selectAll('*').remove();
        if (!selected.length) {
            svg.append('text').attr('x', 20).attr('y', 20).text('Select parameter');
            return;
        }
        const arr = data[selected[0]].slice(burnin);
        const width = 600,
            height = 300;
        svg.attr('viewBox', `0 0 ${width} ${height}`);
        const x = d3
            .scaleLinear()
            .domain([0, arr.length - 1])
            .range([0, width]);
        const y = d3
            .scaleLinear()
            .domain([d3.min(arr)!, d3.max(arr)!])
            .range([height, 0]);
        const line = d3
            .line<number>()
            .x((_, i) => x(i))
            .y((v) => y(v));
        svg.append('path')
            .datum(arr)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('d', line as any);
    });
    return <svg ref={ref} width="600" height="300"></svg>;
};
export default TraceChart;
