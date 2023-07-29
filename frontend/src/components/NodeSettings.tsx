// src/components/NodeSettings.tsx
import React, { useState, useEffect } from 'react';
import ColorPalette from './ColorPalette';
import ColorPickerPopup from './ColorPickerPopup';
import ColorButton from './ColorButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { addNode, addEdge, hideNodeSettings, showToolbuttonAction, togglePicker, hidePicker } from '../redux/actions';
import '../styles/NodeSettings.css';
import { NODE_WIDTH } from '../constants/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';


const NodeSettings: React.FC = () => {
  const dispatch = useDispatch();
  const toolbuttonPosition = useSelector((state: RootState) => state.toolbuttonPosition);
  const popupPosition = useSelector((state: RootState) => state.popupPosition);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const color = useSelector((state: RootState) => state.colorState.color);
  const backgroundColor = useSelector((state: RootState) => state.colorState.backgroundColor);
  const [edgeConnection, setEdgeConnection] = useState(false);
  const selectedNodeId = useSelector((state: RootState) => state.selectedNodeId);
  const selectedNodeName = useSelector((state: RootState) => state.nodes.find(node => node.id === selectedNodeId)?.name);
  const [colorInput, setColorInput] = useState('');
  const showColorPicker = useSelector(
    (state: RootState) => state.showPicker.color
  );
  const showBackgroundColorPicker = useSelector(
    (state: RootState) => state.showPicker.background
  );

  useEffect(() => {
    setColorInput(color.substring(1)); // Update colorInput whenever color changes
  }, [color]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const node = {
      id: uuidv4(),
      name: title,
      description: description,
      color: color,
      backgroundColor: backgroundColor,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    dispatch(addNode(node));

    if (edgeConnection && selectedNodeId !== null) {
      const edge = {
        id: uuidv4(),
        source: selectedNodeId,
        target: node.id,
      };
      dispatch(addEdge(edge));
    }

    dispatch(hideNodeSettings());
  };

  const handleBack = () => {
    dispatch(hideNodeSettings());
    dispatch(showToolbuttonAction(true));
  };



  return (
    <div
      className="node-settings"
      style={{
        top: `${toolbuttonPosition.y}px`,
        left: `${toolbuttonPosition.x + NODE_WIDTH}px`,
      }}
      onClick={() => {
        dispatch(hidePicker('color'));
        dispatch(hidePicker('background'));
      }}
    >
      <div className="node-name">From {selectedNodeName}</div>
      <div className="back-button-container" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} className="back-button" />
      </div>
      <label>
        Title
        <input
          className="node-settings-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title here"
        />
      </label>

      <label>
        Description
        <textarea
          className="node-settings-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description here"
        />
      </label>

      {
        <label>
          Color
          <div className="color-container" style={{ position: 'relative' }}>
            <ColorButton color={color} onClick={() => dispatch(togglePicker('color'))} />
            {showColorPicker && <ColorPickerPopup colorType="color" />}
            <ColorPalette paletteType="color" />
          </div>
        </label>
      }

      {
        <label>
          Background Color
          <div className="color-container" style={{ position: 'relative' }}>
            <ColorButton color={backgroundColor} onClick={() => dispatch(togglePicker('background'))} />
            {showBackgroundColorPicker && <ColorPickerPopup colorType="background" />}
            <ColorPalette paletteType="background" />
          </div>
        </label>
      }


      <label>
        Edge Connection
        <input
          type="checkbox"
          checked={edgeConnection}
          onChange={(e) => setEdgeConnection(e.target.checked)}
        />
      </label>

      <div className="buttons-container">
        <button className="node-settings-button" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default NodeSettings;