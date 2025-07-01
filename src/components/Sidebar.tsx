import React from 'react';
import DraggableComponent from './DraggableComponent';

const COMPONENTS: { type: 'label' | 'table' | 'image'; name: string }[] = [
    { type: 'label', name: '라벨' },
    { type: 'table', name: '테이블' },
    { type: 'image', name: '이미지' },
];

function Sidebar() {
    return (
        <div style={{ width: 200, padding: 10, background: '#f4f4f4' }}>
            <h3>컴포넌트</h3>
            {COMPONENTS.map((comp) => (
                <DraggableComponent key={comp.type} type={comp.type} name={comp.name} />
            ))}
        </div>
    );
}

export default Sidebar;
