'use client';

import { useCallback, useRef } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    type Node,
    type Edge,
    type Connection,
    type XYPosition
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

// Generate a unique node ID
let id = 1;
const getId = () => `node_${id++}`;

// Inner component that uses the ReactFlow hooks
function FlowContent() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    // This function is called when a connection drag ends
    const onConnectEnd = useCallback(
        (event: MouseEvent | TouchEvent) => {
            // Get the position where the connection was dropped
            const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

            if (targetIsPane) {
                // Only create a new node if the connection is dropped on the pane
                const id = getId();

                // Get the client coordinates from the event
                const { clientX, clientY } = 'changedTouches' in event
                    ? event.changedTouches[0]
                    : (event as MouseEvent);

                // Convert screen position to flow position
                const position = screenToFlowPosition({
                    x: clientX,
                    y: clientY,
                }) as XYPosition;

                // Create a new node at the drop position
                const newNode: Node = {
                    id,
                    type: 'chatNode',
                    position,
                    data: {},
                };

                // Add the new node
                setNodes((nds) => [...nds, newNode]);

                // Create a new connection from the source to the new node
                // We need to use the connection state to get the source node
                // This will be handled in onConnectStart
                if (connectionNodeId.current) {
                    const newEdge: Edge = {
                        id: `edge-${connectionNodeId.current}-${id}`,
                        source: connectionNodeId.current,
                        target: id,
                    };

                    setEdges((eds) => [...eds, newEdge]);
                }
            }

            // Reset the connection node id
            connectionNodeId.current = null;
        },
        [screenToFlowPosition, setNodes, setEdges]
    );

    // Store the id of the node where the connection starts
    const connectionNodeId = useRef<string | null>(null);

    // This function is called when a connection drag starts
    const onConnectStart = useCallback((_: unknown, { nodeId }: { nodeId: string | null }) => {
        connectionNodeId.current = nodeId;
    }, []);

    return (
        <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                nodeTypes={nodeTypes}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background />
            </ReactFlow>
        </div>
    );
}

// Outer component that provides the ReactFlow context
export default function Flow() {
    return (
        <ReactFlowProvider>
            <FlowContent />
        </ReactFlowProvider>
    );
}
