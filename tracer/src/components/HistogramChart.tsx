import { Component, createEffect } from 'solid-js';
import * as d3 from 'd3';
import { state } from '../store/traceStore';
import { Bin, histogram } from '../utils/histogram';
import { trimmedMinMax } from '../utils/stats';

const HistogramChart: Component = () => {
  let ref!: SVGSVGElement;

  createEffect(() => {
    const svg = d3.select(ref);
    svg.selectAll('*').remove();

    if (!state.selected.length) {
      svg.append('text').attr('x', 20).attr('y', 20).text('Select parameter');
      return;
    }

    const arr = state.data[state.selected[0]]?.slice(state.burnin) ?? [];
    if (arr.length === 0) {
      svg.append('text').attr('x', 20).attr('y', 20).text('No data available');
      return;
    }

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const [trimmedMin, trimmedMax] = trimmedMinMax(arr);
    const range = trimmedMax - trimmedMin;
    const binsCount = Math.min(Math.max(Math.ceil(Math.sqrt(arr.length)), 10), 50); 
    const bins = histogram(arr, binsCount);

    const sorted = [...arr].sort((a, b) => a - b);
    const lowerThreshold = d3.quantile(sorted, 0.05)!;
    const upperThreshold = d3.quantile(sorted, 0.95)!;

    const x = d3.scaleLinear()
      .domain([d3.min(arr)!, d3.max(arr)!])
      .range([margin.left, width - margin.right]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.count)!]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('rect')
      .data(bins)
      .enter()
      .append('rect')
      .attr('x', d => x(d.bin))
      .attr('y', d => y(d.count))
      .attr('width', (width - margin.left - margin.right) / bins.length - 1)
      .attr('height', d => y(0) - y(d.count))
      .attr('fill', d => {
        const binEnd = d.bin + (x(bins[1].bin) - x(bins[0].bin));
        return (binEnd <= lowerThreshold || d.bin >= upperThreshold) ? 'orange' : 'steelblue';
      });

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  });

  return <svg ref={ref} width="600" height="300"></svg>;
};

export default HistogramChart;