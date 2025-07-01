import React from 'react';
import { ReportComponent } from '../App';

interface Props {
  components: ReportComponent[];
  onClose: () => void;
}

function Preview({ components, onClose }: Props) {
  return (
    <div style={{ padding: 20 }}>
      <button onClick={onClose}>닫기</button>
      <div style={{ position: 'relative', background: 'white', minHeight: '90vh' }}>
        {components.map((comp) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            left: comp.x,
            top: comp.y,
            width: comp.width,
            height: comp.height,
          };
          if (comp.type === 'label') {
            return (
              <div key={comp.id} style={style}>
                {comp.text}
              </div>
            );
          }
          if (comp.type === 'table') {
            return (
              <table key={comp.id} style={{ ...style, borderCollapse: 'collapse' }}>
                <tbody>
                  {comp.tableData?.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          style={{ border: '1px solid #000', padding: 4 }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default Preview;
