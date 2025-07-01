import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ReportComponent } from '../App';
import { Rnd } from 'react-rnd';

interface Props {
    components: ReportComponent[];
    setComponents: React.Dispatch<React.SetStateAction<ReportComponent[]>>;
}

function Canvas({ components, setComponents }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingCell, setEditingCell] = useState<{ id: number; row: number; col: number } | null>(null);
    const [editText, setEditText] = useState('');

    const [selectedId, setSelectedId] = useState<number | null>(null);

    const divRef = React.useRef<HTMLDivElement>(null);
    const [{ }, dropRef] = useDrop({
        accept: 'COMPONENT',
        drop: (item: any, monitor) => {
            const offset = monitor.getClientOffset();
            if (!offset) return;

            const newComp: ReportComponent = {
                id: Date.now(),
                type: item.type,
                x: offset.x - 220,
                y: offset.y - 20,
                text: item.type === 'label' ? '새 라벨' : '',
                tableData: item.type === 'table' ? [['']] : undefined,
                width: item.type === 'table' ? 200 : undefined,
                height: item.type === 'table' ? 100 : undefined,
            };

            setComponents((prev) => [...prev, newComp]);
        },
        collect: (monitor) => ({}),
    });

    // Attach dropRef to the divRef
    React.useEffect(() => {
        if (divRef.current) {
            dropRef(divRef.current);
        }
    }, [dropRef]);

    const handleDoubleClick = (id: number, text: string) => {
        setEditingId(id);
        setEditText(text);
    };
    const handleBlur = (id: number): void => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === id ? { ...comp, text: editText } : comp
            )
        );
        setEditingId(null);
    };

    const handleCellDoubleClick = (id: number, row: number, col: number, text: string) => {
        setEditingCell({ id, row, col });
        setEditText(text);
    };
    const handleCellBlur = (id: number, row: number, col: number) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === id
                    ? {
                        ...comp,
                        tableData: comp.tableData?.map((r, ri) =>
                            ri === row
                                ? r.map((c, ci) => (ci === col ? editText : c))
                                : r
                        ),
                    }
                    : comp
            )
        );
        setEditingCell(null);
    };

    const handleDelete = (id: number) => {
        setComponents((prev) => prev.filter((comp) => comp.id !== id));
        if (editingId === id) setEditingId(null);
        if (selectedId === id) setSelectedId(null);
    };

    const addRow = (id: number) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === id
                    ? {
                        ...comp,
                        tableData: [
                            ...(comp.tableData || []),
                            Array(comp.tableData?.[0]?.length || 1).fill(''),
                        ],
                    }
                    : comp
            )
        );
    };

    const addColumn = (id: number) => {
        setComponents((prev) =>
            prev.map((comp) =>
                comp.id === id
                    ? {
                        ...comp,
                        tableData: comp.tableData?.map((row) => [...row, '']),
                    }
                    : comp
            )
        );
    };

    return (
        <div ref={divRef} style={{ flex: 1, background: 'white', position: 'relative' }}>
            {components.map((comp) => (
                <Rnd
                    key={comp.id}
                    size={{ width: comp.width || 120, height: comp.height || 40 }}
                    position={{ x: comp.x, y: comp.y }}
                    onClick={() => setSelectedId(comp.id)}
                    onDragStop={(e, d) => {
                        setComponents((prev) =>
                            prev.map((c) =>
                                c.id === comp.id ? { ...c, x: d.x, y: d.y } : c
                            )
                        );
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        setComponents((prev) =>
                            prev.map((c) =>
                                c.id === comp.id
                                    ? {
                                        ...c,
                                        width: parseInt(ref.style.width),
                                        height: parseInt(ref.style.height),
                                        x: position.x,
                                        y: position.y,
                                    }
                                    : c
                            )
                        );
                    }}
                    bounds="parent"
                >
                    <div
                        onDoubleClick={() => {
                            if (comp.type === 'label') {
                                handleDoubleClick(comp.id, comp.text || '');
                            }
                        }}
                        style={{ width: '100%', height: '100%', position: 'relative' }}
                    >
                        {comp.type === 'label' && (
                            editingId === comp.id ? (
                                <input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onBlur={() => handleBlur(comp.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleBlur(comp.id);
                                    }}
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        fontSize: 'inherit',
                                        border: '1px solid gray',
                                    }}
                                />
                            ) : (
                                <span>{comp.text}</span>
                            )
                        )}
                        {comp.type === 'table' && (
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {comp.tableData?.map((row, ri) => (
                                        <tr key={ri}>
                                            {row.map((cell, ci) => (
                                                <td
                                                    key={ci}
                                                    style={{ border: '1px solid #ccc', padding: 4 }}
                                                    onDoubleClick={() => handleCellDoubleClick(comp.id, ri, ci, cell)}
                                                >
                                                    {editingCell && editingCell.id === comp.id && editingCell.row === ri && editingCell.col === ci ? (
                                                        <input
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            onBlur={() => handleCellBlur(comp.id, ri, ci)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleCellBlur(comp.id, ri, ci);
                                                            }}
                                                            autoFocus
                                                            style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}
                                                        />
                                                    ) : (
                                                        cell
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {selectedId === comp.id && (
                            <>
                                {comp.type === 'table' && (
                                    <div style={{ position: 'absolute', bottom: -24, left: 0 }}>
                                        <button onClick={() => addRow(comp.id)} style={{ marginRight: 4 }}>행 추가</button>
                                        <button onClick={() => addColumn(comp.id)}>열 추가</button>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDelete(comp.id)}
                                    style={{
                                        position: 'absolute',
                                        top: -10,
                                        right: -10,
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 20,
                                        height: 20,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ×
                                </button>
                            </>
                        )}
                    </div>
                </Rnd>
            ))}

        </div>
    );
}

export default Canvas;
