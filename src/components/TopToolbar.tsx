import React from 'react';
import { ReportComponent } from '../App';

interface Props {
  component?: ReportComponent;
  updateStyle: (style: Partial<ReportComponent['style']>) => void;
}

function TopToolbar({ component, updateStyle }: Props) {
  if (!component) return null;
  const style = component.style || {};
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow p-2 flex space-x-2 z-50">
      <div>
        <label className="mr-1">폰트 크기</label>
        <input
          type="number"
          className="border px-1 w-20"
          value={style.fontSize ?? ''}
          onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
        />
      </div>
      <div>
        <label className="mr-1">글자 색상</label>
        <input
          type="color"
          value={style.color || '#000000'}
          onChange={(e) => updateStyle({ color: e.target.value })}
        />
      </div>
      <div>
        <label className="mr-1">배경색</label>
        <input
          type="color"
          value={style.backgroundColor || '#ffffff'}
          onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
        />
      </div>
      <div>
        <label className="mr-1">정렬</label>
        <select
          className="border"
          value={style.textAlign || 'left'}
          onChange={(e) => updateStyle({ textAlign: e.target.value as any })}
        >
          <option value="left">왼쪽</option>
          <option value="center">가운데</option>
          <option value="right">오른쪽</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <label>
          <input
            type="checkbox"
            checked={style.fontWeight === 'bold'}
            onChange={(e) => updateStyle({ fontWeight: e.target.checked ? 'bold' : 'normal' })}
          />
          <span className="ml-1">굵게</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={style.fontStyle === 'italic'}
            onChange={(e) => updateStyle({ fontStyle: e.target.checked ? 'italic' : 'normal' })}
          />
          <span className="ml-1">기울임</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={style.textDecoration === 'underline'}
            onChange={(e) => updateStyle({ textDecoration: e.target.checked ? 'underline' : 'none' })}
          />
          <span className="ml-1">밑줄</span>
        </label>
      </div>
    </div>
  );
}

export default TopToolbar;
