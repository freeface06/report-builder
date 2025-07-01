import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Make sure the Sidebar component exists at this path, or update the path if necessary
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Preview from './components/Preview';

export interface ReportComponent {
  id: number;
  type: 'label' | 'table' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  /**
   * Table data represented as rows and columns of cell text.
   * Only used when type === 'table'.
   */
  tableData?: string[][];
}

function App() {
  const [components, setComponents] = useState<ReportComponent[]>([]);
  const [preview, setPreview] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      {preview ? (
        <Preview components={components} onClose={() => setPreview(false)} />
      ) : (
        <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
          <Sidebar />
          <Canvas components={components} setComponents={setComponents} />
          <button
            onClick={() => setPreview(true)}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            미리보기
          </button>
        </div>
      )}
    </DndProvider>
  );
}

export default App;
