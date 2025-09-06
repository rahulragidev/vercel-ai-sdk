'use client';

import { useChat } from '@ai-sdk/react'
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react'
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
    return <Loader className="animate-spin text-blue-500 w-5 h-5 mx-auto my-2" />;
};

function ChatNode({ isConnectable }: { isConnectable?: boolean }) {
    const { messages, status, sendMessage } = useChat();
    const [input, setInput] = useState('');

    return (
        <div className="max-[250px] rounded-lg overflow-hidden bg-black">
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />

            <div className="flex flex-col h-fit">
                <div className="flex-1 overflow-y-auto p-2">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-[6px] px-[10px] rounded-xl max-w-[80%] ${message.role === 'user'
                                ? 'self-end'
                                : 'self-start'
                                }`}
                        >
                            <div>
                                {message.parts.map((part, index) =>
                                    part.type === 'text' ? <span key={`${message.id}-part-${index}`}>{part.text}</span> : null
                                )}
                            </div>
                        </div>
                    ))}
                    {status === 'streaming' && (
                        <LoadingSpinner />
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
                    className="flex border-t border-solid p-[6px]"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border-none p-[6px]"
                        disabled={status !== 'ready'}
                    />
                    <button
                        type="submit"
                        className="ml-[6px] border-none cursor-pointer"
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