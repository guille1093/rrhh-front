"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Company } from "@/types/organizational-structure";

interface OrganizationalChartProps {
  company: Company;
}

const OrganizationalChart = ({ company }: OrganizationalChartProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (company) {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const nodeWidth = 150;
      const horizontalSpacing = 50;
      const verticalSpacing = 100;

      const layout = (node: any, x: number, y: number): number => {
        const children =
          node.departments ||
          (node.areas ? node.areas : []) ||
          node.positions ||
          [];
        const subtreeWidth = children.reduce(
          (acc: number, child: any) =>
            acc + layout(child, x, y + verticalSpacing),
          0,
        );

        const nodeX =
          x + (subtreeWidth > 0 ? subtreeWidth / 2 - nodeWidth / 2 : 0);

        newNodes.push({
          id: `${node.id}`,
          position: { x: nodeX, y },
          data: { label: node.name },
          type: node.id === company.id ? "input" : "default",
        });

        let childX = x;
        children.forEach((child: any) => {
          const childSubtreeWidth = layout(child, childX, y + verticalSpacing);
          const childNode = newNodes.find((n) => n.id === `${child.id}`);
          if (childNode) {
            newEdges.push({
              id: `edge-${node.id}-${child.id}`,
              source: `${node.id}`,
              target: `${child.id}`,
              animated: true,
            });
          }
          childX += childSubtreeWidth;
        });

        return Math.max(subtreeWidth, nodeWidth + horizontalSpacing);
      };

      layout(company, 0, 0);

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [company]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),

    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),

    [],
  );

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),

    [],
  );

  return (
    <div style={{ width: "100%", height: "800px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
};

export default OrganizationalChart;
