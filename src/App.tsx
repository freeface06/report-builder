import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Make sure the Sidebar component exists at this path, or update the path if necessary
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';

export interface ReportComponent {
  id: number;
  type: 'label' | 'table' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
}

function App() {
  const [components, setComponents] = useState<ReportComponent[]>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <Canvas components={components} setComponents={setComponents} />
      </div>
    </DndProvider>
  );
}

export default App;
