import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Make sure the Sidebar component exists at this path, or update the path if necessary
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Preview from './components/Preview';
import useUndo from './useUndo';

export interface ReportComponent {
  id: number;
  type: 'label' | 'table' | 'image';
  x: number;
  y: number;
  /** Page index that this component belongs to */
  page: number;
  width?: number;
  height?: number;
  text?: string;
  /**
   * Table data represented as rows and columns of cell text.
   * Only used when type === 'table'.
   */
  tableData?: string[][];
  /**
   * Per cell sizes when type === 'table'.
   */
  cellSizes?: { width: number; height: number }[][];
  /**
   * Cell spans for merged cells when type === 'table'.
   */
  cellSpans?: { rowspan: number; colspan: number }[][];
  /**
   * Style for label or table text.
   */
  style?: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
  };
}

function App() {
  const {
    state: components,
    set: setComponents,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndo<ReportComponent[]>([]);
  const [preview, setPreview] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(1);

  return (
    <DndProvider backend={HTML5Backend}>
      {preview ? (
        <Preview
          components={components}
          pageCount={pageCount}
          onClose={() => setPreview(false)}
        />
      ) : (
        <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
          <Sidebar />
          <Canvas
            components={components}
            setComponents={setComponents}
            pageCount={pageCount}
            setPageCount={setPageCount}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
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
