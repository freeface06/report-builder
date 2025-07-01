import React from 'react';
import DraggableComponent from './DraggableComponent';

const COMPONENTS: { type: 'label' | 'table' | 'image'; name: string }[] = [
    { type: 'label', name: 'Label' },
    { type: 'table', name: 'Table' },
    { type: 'image', name: 'Image' },
];

function Sidebar() {
    return (
        <div style={{ width: 200, padding: 10, background: '#f4f4f4' }}>
            <h3>Components</h3>
            {COMPONENTS.map((comp) => (
                <DraggableComponent key={comp.type} type={comp.type} name={comp.name} />
            ))}
        </div>
    );
}

export default Sidebar;
