'use client';

import { useState, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MiniMap
} from '@xyflow/react';
import type {
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Add Tailwind styles for React Flow nodes and edges
const flowStyles = `
.react-flow__node {
  @apply p-[10px] rounded-lg border border-solid border-[#ddd] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200;
}

.react-flow__node:hover {
  @apply shadow-[0_4px_8px_rgba(0,0,0,0.15)] translate-y-[-2px)];
}

.react-flow__edge-path {
  @apply stroke-[#888] stroke-[2px] transition-[stroke] duration-200;
}

.react-flow__edge:hover .react-flow__edge-path {
  @apply stroke-[#555] stroke-[3px];
}

.react-flow__controls {
  @apply shadow-[0_2px_4px_rgba(0,0,0,0.1)] rounded-md;
}

.react-flow__minimap {
  @apply rounded-md;
}

@media (prefers-color-scheme: dark) {
  .react-flow__node {
    @apply bg-[#222] border-[#444] text-[#eee];
  }

  .react-flow__edge-path {
    @apply stroke-[#666];
  }

  .react-flow__edge:hover .react-flow__edge-path {
    @apply stroke-[#999];
  }

  .react-flow__controls {
    @apply bg-[#222];
  }

  .react-flow__controls button {
    @apply bg-[#333] text-[#eee] border-[#444];
  }

  .react-flow__minimap {
    @apply bg-[#222];
  }
}
`;

// Import our custom node
import ChatNode from './ChatNode';

const initialNodes: Node[] = [
    {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Node 1' },
        type: 'default',
    },
    {
        id: '2',
        position: { x: 100, y: 200 },
        data: { label: 'Node 2' },
        type: 'default',
    },
    {
        id: '3',
        position: { x: 250, y: 150 },
        data: { label: 'Node 3' },
        type: 'default',
    },
    {
        id: '4',
        position: { x: 400, y: 150 },
        data: { label: 'Chat Node' },
        type: 'chatNode',
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
];

export default function FlowDiagram() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    // Add the styles to the document using useEffect
    useEffect(() => {
        // Create a cleanup function
        const cleanup = () => {
            const styleEl = document.getElementById('react-flow-tailwind-styles');
            if (styleEl) {
                document.head.removeChild(styleEl);
            }
        };

        // Clean up any existing style first
        cleanup();

        // Add the new style
        const style = document.createElement('style');
        style.id = 'react-flow-tailwind-styles';
        style.textContent = flowStyles;
        document.head.appendChild(style);

        // Return cleanup for unmount
        return cleanup;
    }, []);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        []
    );

    return (
        <div className="w-full h-full rounded-lg overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                defaultEdgeOptions={{ animated: true }}
                nodeTypes={{ chatNode: ChatNode }}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
