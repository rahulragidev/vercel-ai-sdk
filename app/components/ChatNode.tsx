'use client';

import { useChat } from '@ai-sdk/react'
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react'

function ChatNode({ isConnectable }: { isConnectable?: boolean }) {
    const { messages, status, sendMessage } = useChat();
    const [input, setInput] = useState('');

    return (
        <div className="chat-node">
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />

            <div className="chat-content">
                <div className="chat-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-content">
                                {message.parts.map((part, index) =>
                                    part.type === 'text' ? <span key={`${message.id}-part-${index}`}>{part.text}</span> : null
                                )}
                            </div>
                        </div>
                    ))}
                    {status === 'streaming' && (
                        <div className="message ai-message">
                            <div className="message-content">Thinking...</div>
                        </div>
                    )}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (input.trim()) {
                            sendMessage({ text: input });
                            setInput('');
                        }
                    }}
                    className="chat-input-form"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="chat-input"
                        disabled={status !== 'ready'}
                    />
                    <button
                        type="submit"
                        className="chat-submit"
                        disabled={status !== 'ready'}
                    >
                        {status === 'streaming' ? '...' : 'Send'}
                    </button>
                </form>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
            />
        </div>
    );
}

export default ChatNode;