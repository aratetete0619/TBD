import React, { useState, useEffect, MouseEvent } from 'react';
import { RootState } from '../redux/reducers';
import { useDrop } from 'react-dnd';
import Node from './Node';
import Edge from './Edge';
import '../styles/Map.css';
import { Node as NodeType, Edge as EdgeType, Position } from '../types/index';
import { useSelector, useDispatch } from '../hooks/hooks';
import {
  setSelectedNodeId,
  moveNode,
  setLastDeselectedNodeId,
  showToolbuttonAction,
  hideNodeSettings,
  setMapSize,
  setPopupPosition,
} from '../redux/actions';

const Map: React.FC = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.nodes);
  const edges = useSelector((state: RootState) => state.edges);
  const selectedNodeId = useSelector((state: RootState) => state.selectedNodeId);
  const mapSize = useSelector((state: RootState) => state.map);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [viewport, setViewport] = useState<Position>({ x: window.innerWidth, y: window.innerHeight });
  const popupPosition = useSelector((state: RootState) => state.popupPosition);
  const [renderedEdges, setRenderedEdges] = useState<JSX.Element[] | null>(null);

  const startDrag = (e: MouseEvent) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setMouseDown(true);
  };


  const moveDrag = (e: MouseEvent) => {
    if (mouseDown) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      const newTranslate = {
        x: Math.max(Math.min(translate.x + dx, 0), viewport.x - mapSize.width),
        y: Math.max(Math.min(translate.y + dy, 0), viewport.y - mapSize.height),
      };
      setTranslate(newTranslate);
      dispatch(setPopupPosition(newTranslate));
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };


  const stopDrag = (e: MouseEvent) => {
    setMouseDown(false);
  };


  const [, drop] = useDrop({
    accept: `Node`,
    drop: (item: any, monitor: any) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      const newMapWidth = Math.max(left, mapSize.width);
      const newMapHeight = Math.max(top, mapSize.height);
      dispatch(moveNode(item.id, left, top, newMapWidth, newMapHeight));
      dispatch(setMapSize(newMapWidth, newMapHeight));
      dispatch(showToolbuttonAction(false));
      dispatch(setSelectedNodeId(item.id));
      return undefined;
    },
  });


  const handleDeselectNode = () => {
    dispatch(setLastDeselectedNodeId(selectedNodeId));
    dispatch(setSelectedNodeId(null));
    dispatch(showToolbuttonAction(false));
    dispatch(hideNodeSettings());
  }


  const renderEdges = (edges: EdgeType[], nodes: NodeType[], uniqueKey: string) => {
    return edges.map((edge, index) => {
      const fromNode = nodes.find(node => node.id.toString() === edge.source.nodeId);
      const toNode = nodes.find(node => node.id.toString() === edge.target.nodeId);
      if (!fromNode || !toNode) {
        return null;
      }
      return (
        <Edge key={`${uniqueKey}_${index}`}
          fromNode={fromNode}
          toNode={toNode}
        />
      );
    }).filter(edgeElement => edgeElement !== null) as JSX.Element[];
  }


  useEffect(() => {
    setRenderedEdges(renderEdges(edges, nodes, 'map_edges'));
  }, [edges, nodes]);

  function calculateInitialCenter(nodes: NodeType[]): Position {
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return { x: 0, y: 0 };
    }
    const xPositions = nodes.map(node => node.left);
    const yPositions = nodes.map(node => node.top);
    const centerX = (Math.max(...xPositions) + Math.min(...xPositions)) / 2;
    const centerY = (Math.max(...yPositions) + Math.min(...yPositions)) / 2;
    return { x: -centerX, y: -centerY };
  }


  useEffect(() => {
    setTranslate(calculateInitialCenter(nodes));
  }, [nodes]);


  useEffect(() => {
    const handleResize = () => {
      setViewport({ x: window.innerWidth, y: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div
      ref={drop}
      onMouseDown={startDrag}
      onMouseMove={moveDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onClick={handleDeselectNode}
      className="map"
      style={{
        transform: `translate(${translate.x}px, ${translate.y}px)`,
        width: `${mapSize.width}px`,
        height: `${mapSize.height}px`,
      }}
    >
      {Array.isArray(nodes) && nodes.map(node => (
        <Node
          key={node.id}
          node={node}
        />
      ))}
    </div>
  );
}

export default Map;