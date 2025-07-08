import { Component } from 'solid-js';
import { setData, setBurnin } from '../store/traceStore';
import { parseBioTSV } from '../utils/parser';

const FileLoader: Component = () => {
  let fileInput: HTMLInputElement;
  return (
    <div class="p-4">
      <input type="file" accept=".log,.tsv" ref={el => (fileInput = el)} class="border p-1" />
      <label class="ml-4">burn-in:
        <input type="number" min="0" onInput={e => setBurnin(+e.currentTarget.value)} class="ml-2 border p-1 rounded"/>
      </label>
      <button onClick={() => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          const { data, names } = parseBioTSV(text);
          setData(data, names);
        };
        reader.readAsText(file);
      }} class="ml-4 px-2 py-1 bg-blue-600 text-white rounded">Load</button>
    </div>
);};

export default FileLoader;
