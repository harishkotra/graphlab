import React, { useState } from 'react';

const graph = {
  nodes: [
    { id: 'A', x: 50, y: 150 },
    { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 350, y: 150 },
    { id: 'D', x: 200, y: 250 },
  ],
  adj: {
    'A': ['B', 'D'],
    'B': ['A', 'C'],
    'C': ['B', 'D'],
    'D': ['A', 'C'],
  },
  matrix: [
    [0, 1, 0, 1], // A
    [1, 0, 1, 0], // B
    [0, 1, 0, 1], // C
    [1, 0, 1, 0], // D
  ]
};
const nodeMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

export const GraphIntro: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<{ type: string, value: any } | null>(null);

  const isNodeHighlighted = (nodeId: string) => {
    if (!hoveredItem) return false;
    if (hoveredItem.type === 'node' && hoveredItem.value === nodeId) return true;
    if (hoveredItem.type === 'list' && hoveredItem.value === nodeId) return true;
    if (hoveredItem.type === 'matrix-row' && nodeMap[nodeId] === hoveredItem.value) return true;
    if (hoveredItem.type === 'matrix-cell' && (nodeMap[nodeId] === hoveredItem.value.r || nodeMap[nodeId] === hoveredItem.value.c)) return true;
    return false;
  };

  const isEdgeHighlighted = (u: string, v: string) => {
    if (!hoveredItem) return false;
    if (hoveredItem.type === 'matrix-cell') {
        const { r, c } = hoveredItem.value;
        return (nodeMap[u] === r && nodeMap[v] === c) || (nodeMap[u] === c && nodeMap[v] === r);
    }
    return false;
  }

  return (
    <div className="space-y-8">
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p>A <strong>graph</strong> is a fundamental data structure in computer science used to model relationships between objects. It consists of <strong>vertices</strong> (or nodes) and <strong>edges</strong> that connect these vertices.</p>
        <ul className="list-disc list-inside">
            <li><strong>Vertices (Nodes):</strong> Represent the individual entities. In the example below, A, B, C, and D are vertices.</li>
            <li><strong>Edges:</strong> Represent the connection or relationship between two vertices.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Graph Visualization */}
        <div className="relative">
            <svg viewBox="0 0 400 300" className="w-full h-auto bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                {/* Edges */}
                {Object.entries(graph.adj).map(([u, neighbors]) => 
                    neighbors.map(v => {
                        if (u < v) { // Draw each edge once for undirected graph
                            const nodeU = graph.nodes.find(n => n.id === u)!;
                            const nodeV = graph.nodes.find(n => n.id === v)!;
                            return (
                                <line
                                    key={`${u}-${v}`}
                                    x1={nodeU.x} y1={nodeU.y}
                                    x2={nodeV.x} y2={nodeV.y}
                                    stroke={isEdgeHighlighted(u, v) ? '#3b82f6' : '#9ca3af'}
                                    strokeWidth={isEdgeHighlighted(u, v) ? 4 : 2}
                                    className="transition-all duration-200"
                                />
                            );
                        }
                        return null;
                    })
                )}
                {/* Nodes */}
                {graph.nodes.map(node => (
                    <g key={node.id} onMouseEnter={() => setHoveredItem({type: 'node', value: node.id})} onMouseLeave={() => setHoveredItem(null)}>
                        <circle
                            cx={node.x} cy={node.y} r="20"
                            fill={isNodeHighlighted(node.id) ? '#3b82f6' : '#6b7280'}
                            stroke="#fff" strokeWidth="2"
                            className="transition-all duration-200 cursor-pointer"
                        />
                        <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontWeight="bold">{node.id}</text>
                    </g>
                ))}
            </svg>
        </div>

        {/* Representations */}
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-2">Adjacency List</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Each node has a list of its neighbors. Efficient for sparse graphs.</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg font-mono text-sm">
                    {Object.entries(graph.adj).map(([node, neighbors]) => (
                        <div key={node} onMouseEnter={() => setHoveredItem({type: 'list', value: node})} onMouseLeave={() => setHoveredItem(null)} className={`p-1 rounded transition-colors ${isNodeHighlighted(node) ? 'bg-blue-200 dark:bg-blue-800' : ''}`}>
                            <strong>{node}:</strong> [{neighbors.join(', ')}]
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2">Adjacency Matrix</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">A grid where rows and columns represent nodes. A '1' means an edge exists. Efficient for dense graphs.</p>
                <table className="w-full text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <thead>
                        <tr className="font-mono text-sm">
                            <th className="p-2"></th>
                            {graph.nodes.map(n => <th key={n.id} className="p-2">{n.id}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {graph.matrix.map((row, r) => (
                            <tr key={r} onMouseEnter={() => setHoveredItem({type: 'matrix-row', value: r})} onMouseLeave={() => setHoveredItem(null)}>
                                <th className={`font-mono text-sm p-2 ${isNodeHighlighted(graph.nodes[r].id) ? 'text-blue-500' : ''}`}>{graph.nodes[r].id}</th>
                                {row.map((cell, c) => (
                                    <td 
                                        key={c}
                                        onMouseEnter={() => setHoveredItem({type: 'matrix-cell', value: {r, c}})}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        className={`font-mono p-2 rounded transition-colors ${isEdgeHighlighted(graph.nodes[r].id, graph.nodes[c].id) ? 'bg-blue-200 dark:bg-blue-800' : ''}`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};
