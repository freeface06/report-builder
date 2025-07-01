import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportComponent } from '../App';

interface Props {
  components: ReportComponent[];
  onClose: () => void;
}

function Preview({ components, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('preview.pdf');
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="space-x-2 mb-2">
        <button onClick={onClose}>닫기</button>
        <button onClick={exportPDF}>PDF 저장</button>
      </div>
      <div ref={ref} style={{ position: 'relative', background: 'white', minHeight: '90vh' }}>
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
