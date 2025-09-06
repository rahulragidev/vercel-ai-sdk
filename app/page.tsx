'use client';

import dynamic from 'next/dynamic'

// Use dynamic import for React Flow
const FlowDiagram = dynamic(
  () => import('./components/FlowDiagram')
)

export default function Page() {
  return (
    <div className='h-screen'>
      <FlowDiagram />
    </div>
  )
}