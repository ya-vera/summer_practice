import { Component, onMount } from 'solid-js';
import * as d3 from 'd3';
import { state } from '../store/traceStore';

const TraceChart: Component = () => {
    let ref!: SVGSVGElement;

    onMount(() => {
        const svg = d3.select(ref);
        svg.selectAll('*').remove();

        if (!state.selected.length) {
            svg.append('text')
               .attr('x', 20)
               .attr('y', 20)
               .text('Select parameter');
            return;
        }

        const data = state.data[state.selected[0]].slice(state.burnin);
        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };

        const x = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(data)!, d3.max(data)!])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const line = d3.line<number>()
            .x((_, i) => x(i))
            .y(v => y(v));

        svg.append('g')
           .attr('transform', `translate(0,${height - margin.bottom})`)
           .call(d3.axisBottom(x));

        svg.append('g')
           .attr('transform', `translate(${margin.left},0)`)
           .call(d3.axisLeft(y));

        svg.append('path')
           .datum(data)
           .attr('fill', 'none')
           .attr('stroke', 'steelblue')
           .attr('stroke-width', 1.5)
           .attr('d', line as any);
    });

    return <svg ref={ref} width="600" height="300"></svg>;
};

export default TraceChart;