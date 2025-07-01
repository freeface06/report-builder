import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ReportComponent } from '../App';
import { Rnd } from 'react-rnd';
import TopToolbar from './TopToolbar';

interface Props {
    components: ReportComponent[];
    setComponents: React.Dispatch<React.SetStateAction<ReportComponent[]>>;
    pageCount: number;
    setPageCount: React.Dispatch<React.SetStateAction<number>>;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

function Canvas({ components, setComponents, pageCount, setPageCount, undo, redo, canUndo, canRedo }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingCell, setEditingCell] = useState<{ id: number; row: number; col: number } | null>(null);
    const [editText, setEditText] = useState('');

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [resizing, setResizing] = useState<{
        id: number;
        row: number;
        col: number;
        startX: number;
        startY: number;
        startW: number;
        startH: number;
    } | null>(null);
    const [contextCell, setContextCell] = useState<{
        id: number;
        row: number;
        col: number;
        x: number;
        y: number;
    } | null>(null);
    const [selectedCells, setSelectedCells] = useState<{ id: number; cells: { row: number; col: number }[] } | null>(null);

    React.useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!resizing) return;
            const deltaX = e.clientX - resizing.startX;
            const deltaY = e.clientY - resizing.startY;
            setComponents((prev) =>
                prev.map((c) =>
                    c.id === resizing.id
                        ? {
                              ...c,
                              cellSizes: c.cellSizes?.map((row, ri) =>
                                  row.map((cell, ci) =>
                                      ri === resizing.row && ci === resizing.col
                                          ? {
                                                width: Math.max(20, resizing.startW + deltaX),
                                                height: Math.max(20, resizing.startH + deltaY),
                                            }
                                          : cell
                                  )
                              ),
                          }
                        : c
                )
            );
        };
        const handleUp = () => setResizing(null);
        if (resizing) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
        };
    }, [resizing, setComponents]);

    React.useEffect(() => {
        const hide = () => {
            setContextCell(null);
            setSelectedCells(null);
        };
        document.addEventListener('click', hide);
        return () => {
            document.removeEventListener('click', hide);
        };
    }, []);

    const divRef = React.useRef<HTMLDivElement>(null);
    const [{ }, dropRef] = useDrop({
        accept: 'COMPONENT',
        drop: (item: any, monitor) => {
            const offset = monitor.getClientOffset();
            if (!offset) return;

            const toolbarHeight = 50;
            const pageHeight = 1123;
            const pageGap = 20;
            const yOffset = offset.y - toolbarHeight;
            const page = Math.min(
                pageCount - 1,
                Math.max(0, Math.floor(yOffset / (pageHeight + pageGap)))
            );
            const yInPage = yOffset - page * (pageHeight + pageGap);

            const newComp: ReportComponent = {
                id: Date.now(),
                type: item.type,
                page,
                x: offset.x - 220,
                y: yInPage,
                text: item.type === 'label' ? '새 라벨' : '',
                tableData:
                    item.type === 'table'
                        ? [
                              ['', ''],
                              ['', ''],
                          ]
                        : undefined,
                cellSizes:
                    item.type === 'table'
                        ? [
                              [
                                  { width: 100, height: 24 },
                                  { width: 100, height: 24 },
                              ],
                              [
                                  { width: 100, height: 24 },
                                  { width: 100, height: 24 },
                              ],
                          ]
                        : undefined,
                cellSpans:
                    item.type === 'table'
                        ? [
                              [
                                  { rowspan: 1, colspan: 1 },
                                  { rowspan: 1, colspan: 1 },
                              ],
                              [
                                  { rowspan: 1, colspan: 1 },
                                  { rowspan: 1, colspan: 1 },
                              ],
                          ]
                        : undefined,
                width: item.type === 'table' ? 200 : undefined,
                height: item.type === 'table' ? 100 : undefined,
                style: {},
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
    const handleCellClick = (id: number, row: number, col: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.shiftKey) {
            setSelectedCells((prev) => {
                if (!prev || prev.id !== id) return { id, cells: [{ row, col }] };
                const exists = prev.cells.some((c) => c.row === row && c.col === col);
                if (exists) {
                    return { id, cells: prev.cells.filter((c) => !(c.row === row && c.col === col)) };
                }
                return { id, cells: [...prev.cells, { row, col }] };
            });
        } else {
            setSelectedCells({ id, cells: [{ row, col }] });
        }
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
                        cellSizes: [
                            ...(comp.cellSizes || []),
                            Array(comp.cellSizes?.[0]?.length || 1).fill({
                                width: 100,
                                height: 24,
                            }),
                        ],
                        cellSpans: [
                            ...(comp.cellSpans || []),
                            Array(comp.cellSpans?.[0]?.length || 1).fill({ rowspan: 1, colspan: 1 }),
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
                        cellSizes: comp.cellSizes?.map((row) => [
                            ...row,
                            { width: 100, height: 24 },
                        ]),
                        cellSpans: comp.cellSpans?.map((row) => [
                            ...row,
                            { rowspan: 1, colspan: 1 },
                        ]),
                    }
                    : comp
            )
        );
    };

    const mergeRight = (id: number, row: number, col: number) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (comp.id !== id) return comp;
                if (!comp.cellSpans) return comp;
                if (col >= (comp.tableData?.[row].length || 0) - 1) return comp;
                if (comp.cellSpans[row][col + 1].colspan === 0) return comp;
                const spans = comp.cellSpans.map((r) => r.map((c) => ({ ...c })));
                const sizes = comp.cellSizes?.map((r) => r.map((c) => ({ ...c }))) || [];
                spans[row][col].colspan += spans[row][col + 1].colspan;
                spans[row][col + 1] = { rowspan: 0, colspan: 0 };
                if (sizes[row]) {
                    sizes[row][col].width += sizes[row][col + 1].width;
                }
                return { ...comp, cellSpans: spans, cellSizes: sizes };
            })
        );
    };

    const mergeDown = (id: number, row: number, col: number) => {
        setComponents((prev) =>
            prev.map((comp) => {
                if (comp.id !== id) return comp;
                if (!comp.cellSpans) return comp;
                if (row >= (comp.tableData?.length || 0) - 1) return comp;
                if (comp.cellSpans[row + 1][col].rowspan === 0) return comp;
                const spans = comp.cellSpans.map((r) => r.map((c) => ({ ...c })));
                const sizes = comp.cellSizes?.map((r) => r.map((c) => ({ ...c }))) || [];
                spans[row][col].rowspan += spans[row + 1][col].rowspan;
                spans[row + 1][col] = { rowspan: 0, colspan: 0 };
                if (sizes[row]) {
                    sizes[row][col].height += sizes[row + 1][col].height;
                }
                return { ...comp, cellSpans: spans, cellSizes: sizes };
            })
        );
    };

    const mergeSelected = () => {
        if (!selectedCells) return;
        const { id, cells } = selectedCells;
        if (cells.length <= 1) return;
        const rows = cells.map((c) => c.row);
        const cols = cells.map((c) => c.col);
        const minR = Math.min(...rows);
        const maxR = Math.max(...rows);
        const minC = Math.min(...cols);
        const maxC = Math.max(...cols);
        setComponents((prev) =>
            prev.map((comp) => {
                if (comp.id !== id || !comp.cellSpans || !comp.cellSizes) return comp;
                const spans = comp.cellSpans.map((r) => r.map((c) => ({ ...c })));
                const sizes = comp.cellSizes.map((r) => r.map((c) => ({ ...c })));
                const width = sizes[minR].slice(minC, maxC + 1).reduce((a, b) => a + b.width, 0);
                const height = sizes.slice(minR, maxR + 1).reduce((a, r) => a + r[minC].height, 0);
                for (let r = minR; r <= maxR; r++) {
                    for (let c = minC; c <= maxC; c++) {
                        spans[r][c] = { rowspan: 0, colspan: 0 };
                    }
                }
                spans[minR][minC] = { rowspan: maxR - minR + 1, colspan: maxC - minC + 1 };
                sizes[minR][minC] = { width, height };
                return { ...comp, cellSpans: spans, cellSizes: sizes };
            })
        );
        setSelectedCells({ id, cells: [{ row: minR, col: minC }] });
    };

    const unmergeSelected = () => {
        if (!selectedCells) return;
        const { id, cells } = selectedCells;
        const rows = cells.map((c) => c.row);
        const cols = cells.map((c) => c.col);
        const minR = Math.min(...rows);
        const maxR = Math.max(...rows);
        const minC = Math.min(...cols);
        const maxC = Math.max(...cols);
        setComponents((prev) =>
            prev.map((comp) => {
                if (comp.id !== id || !comp.cellSpans || !comp.cellSizes) return comp;
                const spans = comp.cellSpans.map((r) => r.map((c) => ({ ...c })));
                const sizes = comp.cellSizes.map((r) => r.map((c) => ({ ...c })));
                for (let r = minR; r <= maxR; r++) {
                    for (let c = minC; c <= maxC; c++) {
                        spans[r][c] = { rowspan: 1, colspan: 1 };
                        sizes[r][c] = { width: 100, height: 24 };
                    }
                }
                return { ...comp, cellSpans: spans, cellSizes: sizes };
            })
        );
        setSelectedCells(null);
    };

    const updateStyle = (id: number, style: Partial<ReportComponent['style']>) => {
        setComponents((prev) =>
            prev.map((c) => (c.id === id ? { ...c, style: { ...c.style, ...style } } : c))
        );
    };

    const selectedComponent = components.find((c) => c.id === selectedId);

    return (
        <div ref={divRef} style={{ flex: 1, background: '#e5e5e5', position: 'relative', paddingTop: 50, overflow: 'auto' }}>
            <TopToolbar
                component={selectedComponent}
                updateStyle={(style) => {
                    if (selectedId) updateStyle(selectedId, style);
                }}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            {Array.from({ length: pageCount }).map((_, pageIndex) => (
                <div
                    key={pageIndex}
                    style={{
                        width: 794,
                        height: 1123,
                        margin: '0 auto 20px',
                        background: 'white',
                        border: '1px solid #ccc',
                        position: 'relative',
                    }}
                >
                    {components
                        .filter((c) => c.page === pageIndex)
                        .map((comp) => (
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
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            textAlign: comp.style?.textAlign,
                            fontSize: comp.style?.fontSize,
                            color: comp.style?.color,
                            backgroundColor: comp.style?.backgroundColor,
                            fontWeight: comp.style?.fontWeight,
                            fontStyle: comp.style?.fontStyle,
                            textDecoration: comp.style?.textDecoration,
                        }}
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
                            <table
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderCollapse: 'collapse',
                                    textAlign: comp.style?.textAlign,
                                    fontSize: comp.style?.fontSize,
                                    color: comp.style?.color,
                                    backgroundColor: comp.style?.backgroundColor,
                                    fontWeight: comp.style?.fontWeight,
                                    fontStyle: comp.style?.fontStyle,
                                    textDecoration: comp.style?.textDecoration,
                                }}
                            >
                                <tbody>
                                    {comp.tableData?.map((row, ri) => (
                                        <tr key={ri}>
                                            {row.map((cell, ci) => (
                                                comp.cellSpans?.[ri]?.[ci]?.colspan === 0 || comp.cellSpans?.[ri]?.[ci]?.rowspan === 0 ? null : (
                                                <td
                                                    key={ci}
                                                    rowSpan={comp.cellSpans?.[ri]?.[ci]?.rowspan || 1}
                                                    colSpan={comp.cellSpans?.[ri]?.[ci]?.colspan || 1}
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        padding: 4,
                                                        position: 'relative',
                                                        width: comp.cellSizes?.[ri]?.[ci]?.width,
                                                        height: comp.cellSizes?.[ri]?.[ci]?.height,
                                                        background:
                                                            selectedCells &&
                                                            selectedCells.id === comp.id &&
                                                            selectedCells.cells.some((c) => c.row === ri && c.col === ci)
                                                                ? '#dbeafe'
                                                                : undefined,
                                                    }}
                                                    onClick={(e) => handleCellClick(comp.id, ri, ci, e)}
                                                    onDoubleClick={() => handleCellDoubleClick(comp.id, ri, ci, cell)}
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        setContextCell({ id: comp.id, row: ri, col: ci, x: e.clientX, y: e.clientY });
                                                    }}
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
                                                    <div
                                                        onMouseDown={(e) =>
                                                            setResizing({
                                                                id: comp.id,
                                                                row: ri,
                                                                col: ci,
                                                                startX: e.clientX,
                                                                startY: e.clientY,
                                                                startW: comp.cellSizes?.[ri]?.[ci]?.width || 100,
                                                                startH: comp.cellSizes?.[ri]?.[ci]?.height || 24,
                                                            })
                                                        }
                                                        style={{
                                                            position: 'absolute',
                                                            width: 10,
                                                            height: 10,
                                                            bottom: 0,
                                                            right: 0,
                                                            cursor: 'se-resize',
                                                            background: 'transparent',
                                                        }}
                                                    />
                                                </td>
                                                )
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
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addRow(comp.id);
                                            }}
                                            style={{ marginRight: 4 }}
                                        >
                                            행 추가
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addColumn(comp.id);
                                            }}
                                        >
                                            열 추가
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(comp.id);
                                    }}
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
                                        zIndex: 50,
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
            ))}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <button onClick={() => setPageCount((p) => p + 1)}>페이지 추가</button>
            </div>
            {contextCell && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextCell.y,
                        left: contextCell.x,
                        background: 'white',
                        border: '1px solid #ccc',
                        zIndex: 1000,
                    }}
                >
                    <button
                        onClick={() => {
                            mergeSelected();
                            setContextCell(null);
                        }}
                        style={{ display: 'block', width: '100%', padding: 4 }}
                    >
                        셀 병합
                    </button>
                    <button
                        onClick={() => {
                            unmergeSelected();
                            setContextCell(null);
                        }}
                        style={{ display: 'block', width: '100%', padding: 4 }}
                    >
                        병합 해제
                    </button>
                </div>
            )}

        </div>
    );
}

export default Canvas;
