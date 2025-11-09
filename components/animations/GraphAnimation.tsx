import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { AnimationData, Step, GraphData, Node as GraphNode, Edge } from '../../lib/animations/types';

const NODE_RADIUS = 25;
const SET_COLORS = ['#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#60a5fa', '#818cf8', '#f87171', '#fb923c'];
const BIPARTITE_COLORS = { color1: '#3b82f6', color2: '#f97316' }; // blue, orange

const getEdgeKey = (edge: Edge | {from: string, to: string}) => {
    return [edge.from, edge.to].sort().join('-');
}
const getDirectedEdgeKey = (from: string, to: string) => `${from}->${to}`;


export const GraphAnimation: React.FC<AnimationData & { externalStep?: number, onStepChange?: (step: number) => void }> = ({ description, graphData, steps, dataStructureName, nodeIndexMap, externalStep, onStepChange }) => {
  const [internalStep, setInternalStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const isExternallyControlled = externalStep !== undefined && onStepChange !== undefined;
  const step = isExternallyControlled ? externalStep : internalStep;
  const setStep = isExternallyControlled ? onStepChange : setInternalStep;

  const currentStep: Step = useMemo(() => steps[step] || steps[steps.length - 1], [steps, step]);
  const currentGraph = useMemo(() => currentStep.graphData || graphData, [currentStep.graphData, graphData]);
  const { nodes, edges, adj } = currentGraph;


  const stableSetRoots = useMemo(() => {
    if (!steps[0]?.nodeSets) return [];
    const roots = new Set<string>();
    steps.forEach(s => {
        if(s.nodeSets) {
            Object.values(s.nodeSets).forEach(root => roots.add(root as string));
        }
    });
    return Array.from(roots).sort();
  }, [steps]);


  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [steps, setStep]);

  const resetAnimation = useCallback(() => {
    setStep(0);
    setIsPlaying(false);
  }, [setStep]);

  const handleNext = useCallback(() => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
    setIsPlaying(false);
  }, [step, steps.length, setStep]);

  const handlePrev = useCallback(() => {
    if (step > 0) {
      setStep(step - 1);
    }
    setIsPlaying(false);
  }, [step, setStep]);
  
  useEffect(() => {
    if (isPlaying) {
      if (step < steps.length - 1) {
        const timer = setTimeout(() => {
          setStep(step + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        setIsPlaying(false);
      }
    }
  }, [step, isPlaying, steps.length, speed, setStep]);

  const getNodeColor = (nodeId: string) => {
    if (currentStep.cutSetS) {
      return currentStep.cutSetS.has(nodeId) ? BIPARTITE_COLORS.color1 : BIPARTITE_COLORS.color2;
    }
    if (currentStep.nodeColors) {
        const color = currentStep.nodeColors[nodeId];
        if (color === 'gray') return '#f97316'; // orange-500 for 'visiting'
        if (color === 'black') return '#6b7280'; // gray-500 for 'finished'
        if (color === 'color1') return BIPARTITE_COLORS.color1;
        if (color === 'color2') return BIPARTITE_COLORS.color2;
        return '#d1d5db'; // gray-300 for 'unvisited' / 'uncolored'
    }
    if (currentStep.nodeSets) {
        const rootId = currentStep.nodeSets[nodeId];
        const rootIndex = stableSetRoots.indexOf(rootId);
        return SET_COLORS[rootIndex % SET_COLORS.length];
    }
     if (currentStep.matrixHighlights && nodeIndexMap) {
        const nodeIndex = nodeIndexMap[nodeId];
        if(nodeIndex === currentStep.matrixHighlights.k) return '#f43f5e'; // rose-500 for intermediate node k
        if(nodeIndex === currentStep.matrixHighlights.i) return '#3b82f6'; // blue-500
        if(nodeIndex === currentStep.matrixHighlights.j) return '#f97316'; // orange-500
    }
    const isCurrent = currentStep.currentNode === nodeId;
    const isNeighbor = currentStep.neighbor === nodeId;
    const isVisited = currentStep.visited?.has(nodeId);

    if (isCurrent) return '#3b82f6'; // blue-500
    if (isNeighbor) return '#f97316'; // orange-500
    if (isVisited) return '#6b7280'; // gray-500
    return '#d1d5db'; // gray-300
  };
  
  const getEdgeColor = (node1Id: string, node2Id: string) => {
    if (currentStep.conflictingEdge && getEdgeKey(currentStep.conflictingEdge) === getEdgeKey({from: node1Id, to: node2Id})) {
        return '#ef4444'; // red-500 for conflicting edge in bipartite check
    }

    if (currentStep.highlightedCycle) {
      for (let i = 0; i < currentStep.highlightedCycle.length; i++) {
        const u = currentStep.highlightedCycle[i];
        const v = currentStep.highlightedCycle[(i + 1) % currentStep.highlightedCycle.length];
        if ((u === node1Id && v === node2Id) || (u === node2Id && v === node1Id)) {
          return '#ef4444'; // red-500 for cycle
        }
      }
    }
    
    if (currentStep.highlightedPath) {
      for (let i = 0; i < currentStep.highlightedPath.length - 1; i++) {
        const u = currentStep.highlightedPath[i];
        const v = currentStep.highlightedPath[i + 1];
        if ((u === node1Id && v === node2Id) || (u === node2Id && v === node1Id)) {
          return '#3b82f6'; // blue-500 for current path
        }
      }
    }

    const key = [node1Id, node2Id].sort().join('-');
    const directedKey = getDirectedEdgeKey(node1Id, node2Id);
    if (currentStep.mstEdges?.has(key) || currentStep.flows?.[directedKey]! > 0) return '#10b981'; // green-500 for MST or flow

    const isHighlight = currentStep.highlightedEdge && (getEdgeKey(currentStep.highlightedEdge) === key || (currentGraph.directed && currentStep.highlightedEdge.from === node1Id && currentStep.highlightedEdge.to === node2Id));
    const isExploring = (currentStep.currentNode === node1Id && currentStep.neighbor === node2Id) ||
                        (currentStep.currentNode === node2Id && currentStep.neighbor === node1Id);
    
    if (isHighlight || isExploring) return '#f97316'; // orange-500 for exploration
    return '#9ca3af'; // gray-400
  }

  const sortedNodesForMatrix = useMemo(() => {
    if (!nodeIndexMap) return [];
    return Object.entries(nodeIndexMap).sort(([, a], [, b]) => a - b).map(([id]) => id);
  }, [nodeIndexMap]);

  const isGrid = currentGraph.layout === 'grid';
  const isTree = currentGraph.layout === 'tree';
  const gridRows = currentGraph.grid?.length || 0;
  const gridCols = currentGraph.grid?.[0]?.length || 0;
  const CELL_SIZE = 50;
  const PADDING = 20;
  const gridWidth = gridCols * CELL_SIZE + 2 * PADDING;
  const gridHeight = gridRows * CELL_SIZE + 2 * PADDING;


  return (
    <div className="flex flex-col gap-8">
      { description && <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: description }} /> }
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <svg viewBox={`0 0 ${isGrid ? gridWidth : 650} ${isGrid ? gridHeight : 400}`} className="w-full h-auto" aria-label="Graph animation">
            <title>Algorithm Animation</title>
            <desc>An animated representation of a graph being traversed by an algorithm.</desc>
            
            {isGrid ? (
              <g transform={`translate(${PADDING}, ${PADDING})`}>
                {currentGraph.grid?.map((row, r) => 
                  row.map((cell, c) => {
                    const cellId = `${r}-${c}`;
                    const color = currentStep.cellColors?.[cellId] || (cell === 1 ? '#a78bfa' : '#374151'); // purple for land, gray for water
                    const isCurrent = currentStep.currentNode === cellId;

                    return (
                        <rect
                          key={cellId}
                          x={c * CELL_SIZE}
                          y={r * CELL_SIZE}
                          width={CELL_SIZE}
                          height={CELL_SIZE}
                          fill={color}
                          stroke={isCurrent ? '#fbbf24' : '#4b5563'}
                          strokeWidth={isCurrent ? 4 : 1}
                          className="transition-all duration-300"
                        />
                    );
                  })
                )}
              </g>
            ) : (
             <>
                {/* Edges and Weights */}
                {Object.entries(adj).map(([nodeId, neighbors]) => 
                  (neighbors as string[]).map(neighborId => {
                    const node1 = nodes.find(n => n.id === nodeId);
                    const node2 = nodes.find(n => n.id === neighborId);
                    const isDirected = currentGraph.directed || isTree;

                    if (node1 && node2) {
                      const edge = edges?.find(e => (e.from === nodeId && e.to === neighborId) || (!isDirected && e.from === neighborId && e.to === nodeId));
                      if (isDirected || nodeId < neighborId) {
                          const hasFlow = !!currentStep.flows;
                          const edgeKey = getDirectedEdgeKey(nodeId, neighborId);
                          const flow = currentStep.flows?.[edgeKey] || 0;
                          const capacity = edge?.weight;
                          
                          return (
                            <g key={`${nodeId}-${neighborId}`}>
                              <line 
                                x1={Number(node1.x)} y1={Number(node1.y)}
                                x2={Number(node2.x)} y2={Number(node2.y)}
                                stroke={getEdgeColor(nodeId, neighborId)}
                                strokeWidth="3"
                                className="transition-all duration-300"
                                markerEnd={isDirected ? "url(#arrow)" : undefined}
                              />
                              {(edge?.weight !== undefined) && (
                                  <text
                                      x={(Number(node1.x) + Number(node2.x)) / 2 + (isDirected ? -10 : 0)}
                                      y={(Number(node1.y) + Number(node2.y)) / 2 - 5}
                                      textAnchor="middle"
                                      fill={getEdgeColor(nodeId, neighborId)}
                                      fontSize="14"
                                      fontWeight="bold"
                                      className="transition-all duration-300"
                                  >
                                      {hasFlow ? `${flow}/${capacity}` : edge.weight}
                                  </text>
                              )}
                            </g>
                          )
                      }
                    }
                    return null;
                  })
                )}
                 {/* Added Edges */}
                {currentStep.addedEdges && Array.from(currentStep.addedEdges).map(edgeKey => {
                  const [fromId, toId] = edgeKey.split('->');
                  const node1 = nodes.find(n => n.id === fromId);
                  const node2 = nodes.find(n => n.id === toId);
                  if (!node1 || !node2) return null;
                  return (
                    <line
                      key={`added-${edgeKey}`}
                      x1={Number(node1.x)} y1={Number(node1.y)}
                      x2={Number(node2.x)} y2={Number(node2.y)}
                      stroke="#22c55e" // green-500
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="transition-all duration-300"
                      markerEnd={"url(#arrow-added)"}
                    />
                  );
                })}
                {/* Special Edges (Snakes and Ladders) */}
                {edges?.filter(e => e.type === 'snake' || e.type === 'ladder').map(edge => {
                    const node1 = nodes.find(n => n.id === edge.from);
                    const node2 = nodes.find(n => n.id === edge.to);
                    if (!node1 || !node2) return null;
                    const isSnake = edge.type === 'snake';
                    const color = isSnake ? '#ef4444' : '#22c55e'; // red for snake, green for ladder
                    
                    const midX = (Number(node1.x) + Number(node2.x)) / 2;
                    const midY = (Number(node1.y) + Number(node2.y)) / 2;
                    const controlPointX = midX + (Number(node2.y) - Number(node1.y)) * (isSnake ? 0.15 : -0.15);
                    const controlPointY = midY + (Number(node1.x) - Number(node2.x)) * (isSnake ? 0.15 : -0.15);
                    
                    return (
                        <path
                            key={`${edge.from}-${edge.to}`}
                            d={`M ${Number(node1.x)} ${Number(node1.y)} Q ${controlPointX} ${controlPointY} ${Number(node2.x)} ${Number(node2.y)}`}
                            stroke={color}
                            strokeWidth="4"
                            fill="none"
                            markerEnd={isSnake ? "url(#arrow-snake)" : "url(#arrow-ladder)"}
                            className="opacity-70"
                        />
                    )
                })}
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                    </marker>
                    <marker id="arrow-added" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
                    </marker>
                    <marker id="arrow-snake" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                    </marker>
                    <marker id="arrow-ladder" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
                    </marker>
                </defs>

                {/* Nodes and Distances */}
                {nodes.map(node => {
                  const hasPushRelabelInfo = currentStep.nodeHeights || currentStep.excessFlows;
                  const hasDiscoveryInfo = currentStep.discoveryTime || currentStep.lowLink;
                  const yOffset = hasPushRelabelInfo || hasDiscoveryInfo ? -5 : 5;
                  return (
                  <g key={node.id} role="figure" aria-label={`Node ${node.id}`}>
                    <circle
                      cx={Number(node.x)}
                      cy={Number(node.y)}
                      r={NODE_RADIUS}
                      fill={getNodeColor(node.id)}
                      stroke="#fff"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    <text x={Number(node.x)} y={Number(node.y) + yOffset} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" pointerEvents="none">
                      {node.id}
                    </text>
                    {currentStep.distances && (
                      <text
                          x={Number(node.x)}
                          y={Number(node.y) + NODE_RADIUS + 20}
                          textAnchor="middle"
                          fill={currentStep.currentNode === node.id ? '#3b82f6' : 'currentColor'}
                          fontSize="14"
                          fontWeight="bold"
                          className="transition-colors duration-300"
                      >
                          {currentStep.distances[node.id]}
                      </text>
                    )}
                     {hasDiscoveryInfo && (
                       <text
                          x={Number(node.x)}
                          y={Number(node.y) + 18}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          className="font-mono"
                      >
                         d:{currentStep.discoveryTime?.[node.id] ?? '-'}, l:{currentStep.lowLink?.[node.id] ?? '-'}
                      </text>
                    )}
                    {hasPushRelabelInfo && (
                       <text
                          x={Number(node.x)}
                          y={Number(node.y) + 18}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          className="font-mono"
                      >
                          h:{currentStep.nodeHeights?.[node.id] ?? '-'}, e:{currentStep.excessFlows?.[node.id] ?? '-'}
                      </text>
                    )}
                  </g>
                )})}
            </>
            )}
          </svg>
        </div>

        {(currentStep.distanceMatrix || currentStep.reachabilityMatrix) && nodeIndexMap && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <h3 className="text-lg font-bold mb-3 text-center">{currentStep.distanceMatrix ? 'Distance Matrix' : 'Reachability Matrix'}</h3>
                <table className="w-full text-center table-fixed">
                    <thead>
                        <tr>
                            <th className="p-2 border-b dark:border-gray-600">↓\→</th>
                            {sortedNodesForMatrix.map(nodeId => <th key={nodeId} className="p-2 border-b dark:border-gray-600 font-mono">{nodeId}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedNodesForMatrix.map((rowNodeId, i) => (
                            <tr key={rowNodeId}>
                                <th className="p-2 border-r dark:border-gray-600 font-mono">{rowNodeId}</th>
                                {sortedNodesForMatrix.map((colNodeId, j) => {
                                    const { k } = currentStep.matrixHighlights || {};
                                    const isHighlightCell = i === k || j === k;
                                    const isPathCell = i === currentStep.matrixHighlights?.i && j === currentStep.matrixHighlights?.j;
                                    let cellClass = 'p-2 font-mono transition-colors duration-300';
                                    if(isPathCell) {
                                        cellClass += ' bg-blue-200 dark:bg-blue-800 ring-2 ring-blue-500';
                                    } else if(isHighlightCell) {
                                        cellClass += ' bg-rose-100 dark:bg-rose-900/50';
                                    }
                                    const matrix = currentStep.distanceMatrix || currentStep.reachabilityMatrix;
                                    return (
                                        <td key={colNodeId} className={cellClass}>
                                            {matrix![i][j]}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>


      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800" aria-live="polite">
        <p className="font-mono text-lg text-blue-800 dark:text-blue-200 h-12 flex items-center justify-center">{currentStep.description}</p>
        <div className="mt-4">
          <span className="font-bold text-gray-700 dark:text-gray-300">{dataStructureName}:</span>
          <div className="flex flex-wrap justify-center items-center gap-2 mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md min-h-[50px]">
            {currentStep.dataStructure && currentStep.dataStructure.length > 0 ? currentStep.dataStructure.map((item, index) => (
                <div key={index} className="flex items-center justify-center px-3 h-10 bg-gray-300 dark:bg-gray-600 rounded text-gray-800 dark:text-white font-bold animate-pulse">
                    {item}
                </div>
            )) : <span className="text-gray-500 italic">empty</span>}
          </div>
        </div>
         {currentStep.buckets && (
            <div className="mt-4">
                 <span className="font-bold text-gray-700 dark:text-gray-300">Buckets:</span>
                 <div className="flex flex-wrap justify-center gap-2 mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    {currentStep.buckets.map((bucket, index) => (
                        bucket.length > 0 && (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
                                <span className="font-bold text-sm">{index}:</span>
                                <div className="flex gap-1">
                                    {bucket.map(nodeId => (
                                        <div key={nodeId} className="flex items-center justify-center w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full text-sm font-bold">
                                            {nodeId}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                 </div>
            </div>
         )}
      </div>

     {!isExternallyControlled && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
                <button onClick={handlePrev} disabled={step === 0} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md disabled:opacity-50 transition" aria-label="Previous step">Prev</button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="px-6 py-2 bg-blue-500 text-white rounded-md font-bold transition hover:bg-blue-600 w-24" aria-label={isPlaying ? 'Pause animation' : 'Play animation'}>
                {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={handleNext} disabled={step === steps.length - 1} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md disabled:opacity-50 transition" aria-label="Next step">Next</button>
            </div>
            <button onClick={resetAnimation} className="px-4 py-2 bg-red-500 text-white rounded-md transition hover:bg-red-600" aria-label="Reset animation">Reset</button>
            <div className="flex items-center gap-2">
                <label htmlFor="speed" className="text-sm">Speed</label>
                <input 
                type="range" 
                id="speed"
                min="200"
                max="3000"
                step="100"
                value={3200 - speed}
                onChange={(e) => setSpeed(3200 - Number(e.target.value))}
                className="w-32"
                aria-label="Animation speed control"
                />
            </div>
        </div>
     )}
    </div>
  );
};