import { Component, createEffect } from 'solid-js';
import * as d3 from 'd3';
import { state } from '../store/traceStore';

const TraceChart: Component = () => {
    let ref!: SVGSVGElement;

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

        const data = state.data[state.selected[0]]?.slice(state.burnin) ?? [];
        if (data.length === 0) {
            svg.append('text')
                .attr('x', 20)
                .attr('y', 20)
                .text('No data available');
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

        const xAxis = svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        const yAxis = svg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        const lineGroup = svg.append('g')
            .attr('clip-path', 'url(#clip)');

        lineGroup.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line as any);

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 10])
            .extent([[margin.left, 0], [width - margin.right, height]])
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                const transform = event.transform;
                const newX = transform.rescaleX(x);
                lineGroup.select('path').attr('d', line.x((_, i) => newX(i)) as any);
                xAxis.call(d3.axisBottom(newX));
            });
        svg.call(zoom);

        const tooltip = svg.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');

        tooltip.append('circle')
            .attr('r', 4)
            .attr('fill', 'red');

        tooltip.append('text')
            .attr('x', 8)
            .attr('dy', '.35em')
            .attr('fill', 'black');

        svg.on('mouseover', () => tooltip.style('display', null))
           .on('mouseout', () => tooltip.style('display', 'none'))
           .on('mousemove', (event) => {
               const [xMouse] = d3.pointer(event);
               const xValue = x.invert(xMouse);
               const bisectIndex = d3.bisectLeft(data.map((_, i) => i), xValue);
               const index = Math.min(Math.max(bisectIndex - 1, 0), data.length - 1);
               const value = data[index];

               tooltip.attr('transform', `translate(${x(index)},${y(value)})`);
               tooltip.select('text').text(`${state.selected[0]}: ${value.toFixed(3)}`);
           });
    });

    return <svg ref={ref} width="600" height="300" />;
};

export default TraceChart;