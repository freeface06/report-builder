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

    const handleDelete = (id: number) => {
        setComponents((prev) => prev.filter((comp) => comp.id !== id));
        if (editingId === id) setEditingId(null);
        if (selectedId === id) setSelectedId(null);
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
                        {editingId === comp.id ? (
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
                            <span>{comp.type === 'label' ? comp.text : comp.type.toUpperCase()}</span>
                        )}

                        {selectedId === comp.id && (
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
                        )}
                    </div>
                </Rnd>
            ))}

        </div>
    );
}

export default Canvas;
