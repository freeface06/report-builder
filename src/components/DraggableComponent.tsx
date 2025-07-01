import React from 'react';
import { useDrag } from 'react-dnd';

interface Props {
    type: 'label' | 'table' | 'image';
    name: string;
}

function DraggableComponent({ type, name }: Props) {
    const [, drag] = useDrag(() => ({
        type: 'COMPONENT',
        item: { type },
    }));

    return (
        <div
            ref={drag as unknown as React.Ref<HTMLDivElement>}
            style={{
                padding: 8,
                marginBottom: 10,
                background: 'white',
                border: '1px solid #ccc',
                cursor: 'move',
            }}
        >
            {name}
        </div>
    );
}

export default DraggableComponent;
