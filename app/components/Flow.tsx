'use client';

import { useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    type Node,
    type Edge,
    type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ChatNode from './ChatNode';

// Define custom node types
const nodeTypes = {
    chatNode: ChatNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'chatNode',
        position: { x: 250, y: 250 },
        data: {},
    },
];

const initialEdges: Edge[] = [];

export default function Flow() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    return (
        <ReactFlowProvider>
            <div style={{ width: '100%', height: '100%' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
}
