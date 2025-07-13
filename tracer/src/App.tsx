// import { Component, createSignal } from 'solid-js';
// import FileLoader from './components/FileLoader';
// import ParamList from './components/ParamList';
// import ModeChart from './components/ModeChart';
// import TraceChart from './components/TraceChart';
// import HistogramChart from './components/HistogramChart';
// import BoxplotChart from './components/BoxplotChart';
// import CompareTable from './components/CompareTable';

// const App: Component = () => {
//     const [mode, setMode] = createSignal<'trace' | 'histogram' | 'boxplot' | 'compare'>('trace');

//     return (
//         <div class="min-h-screen flex flex-col bg-gray-50">
//             <h1 class="p-4 text-2xl font-bold">Tracer SPA</h1>
//             <FileLoader />
//             <div class="flex flex-1">
//                 <aside class="w-1/4 border-r p-4 overflow-y-auto">
//                     <ParamList />
//                 </aside>
//                 <main class="w-3/4 p-4 overflow-auto">
//                     <ModeChart onModeChange={setMode} />
//                     {mode() === 'trace' && <TraceChart />}
//                     {mode() === 'histogram' && <HistogramChart />}
//                     {mode() === 'boxplot' && <BoxplotChart />}
//                     {mode() === 'compare' && <CompareTable />}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default App;

import { Component, createSignal } from 'solid-js';
import FileLoader from './components/FileLoader';
import ParamList from './components/ParamList';
import ModeChart from './components/ModeChart';
import TraceChart from './components/TraceChart';
import HistogramChart from './components/HistogramChart';
import BoxplotChart from './components/BoxplotChart';
import CompareTable from './components/CompareTable';

const App: Component = () => {
    const [mode, setMode] = createSignal<'trace' | 'histogram' | 'boxplot' | 'compare'>('trace');

    return (
        <div class="min-h-screen flex flex-col bg-gray-50">
            <h1 class="p-4 text-2xl font-bold">Tracer SPA</h1>
            <FileLoader />
            <div class="flex flex-1">
                <aside class="w-1/4 border-r p-4 overflow-y-auto">
                    <ParamList mode={mode()} />
                </aside>
                <main class="w-3/4 p-4 overflow-auto">
                    <ModeChart onModeChange={setMode} />
                    {mode() === 'trace' && <TraceChart />}
                    {mode() === 'histogram' && <HistogramChart />}
                    {mode() === 'boxplot' && <BoxplotChart />}
                    {mode() === 'compare' && <CompareTable />}
                </main>
            </div>
        </div>
    );
};

export default App;