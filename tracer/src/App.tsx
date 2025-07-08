import { Component, createSignal } from 'solid-js';
import FileLoader from './components/FileLoader';
import ParamList from './components/ParamList';
import { ChartSwitcher } from './components/ChartSwitcher';
import TraceChart from './components/TraceChart';
import HistogramChart from './components/HistogramChart';
import BoxplotChart from './components/BoxplotChart';
import CompareTable from './components/CompareTable';

const App: Component = () => {
  const [mode, setMode] = createSignal('trace');

  // console.log('App, mode:', mode());

  return (
    <div class="min-h-screen bg-gray-50">
      <h1 class="p-4 text-2xl font-bold">Tracer SPA</h1>
      <FileLoader />
      <div class="flex">
        <div class="w-1/4 border-r">
          <ParamList />
        </div>
        <div class="w-3/4 p-4">
          <ChartSwitcher onChange={setMode} />
          {mode() === 'trace' && <TraceChart />}
          {mode() === 'histogram' && <HistogramChart />}
          {mode() === 'boxplot' && <BoxplotChart />}
          {mode() === 'compare' && <CompareTable />}
        </div>
      </div>
    </div>
  );
};

export default App;
