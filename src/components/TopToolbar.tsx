import React from 'react';
import { ReportComponent } from '../App';

interface Props {
  component?: ReportComponent;
  updateStyle: (style: Partial<ReportComponent['style']>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

function TopToolbar({ component, updateStyle, undo, redo, canUndo, canRedo }: Props) {
  const style = component?.style || {};
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-100 shadow flex items-center space-x-4 px-4 py-2 z-50">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="border rounded px-2 py-1 text-sm disabled:opacity-50"
      >
        Undo
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="border rounded px-2 py-1 text-sm disabled:opacity-50"
      >
        Redo
      </button>
      {component && (
        <>
          <div className="flex items-center space-x-1">
            <label className="text-sm">폰트 크기</label>
            <input
              type="number"
              className="border rounded px-2 h-8 w-20"
              value={style.fontSize ?? ''}
              onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center space-x-1">
            <label className="text-sm">글자 색상</label>
            <input
              type="color"
              className="w-8 h-8 p-0 border rounded"
              value={style.color || '#000000'}
              onChange={(e) => updateStyle({ color: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-1">
            <label className="text-sm">배경색</label>
            <input
              type="color"
              className="w-8 h-8 p-0 border rounded"
              value={style.backgroundColor || '#ffffff'}
              onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-1">
            <label className="text-sm">정렬</label>
            <select
              className="border rounded h-8 px-2"
              value={style.textAlign || 'left'}
              onChange={(e) => updateStyle({ textAlign: e.target.value as any })}
            >
              <option value="left">왼쪽</option>
              <option value="center">가운데</option>
              <option value="right">오른쪽</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`border rounded px-2 py-1 text-sm ${style.fontWeight === 'bold' ? 'bg-gray-200' : ''}`}
              onClick={() =>
                updateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })
              }
            >
              <strong>B</strong>
            </button>
            <button
              className={`border rounded px-2 py-1 text-sm italic ${style.fontStyle === 'italic' ? 'bg-gray-200' : ''}`}
              onClick={() =>
                updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })
              }
            >
              I
            </button>
            <button
              className={`border rounded px-2 py-1 text-sm ${style.textDecoration === 'underline' ? 'bg-gray-200' : ''}`}
              onClick={() =>
                updateStyle({ textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' })
              }
            >
              <span className="underline">U</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TopToolbar;
