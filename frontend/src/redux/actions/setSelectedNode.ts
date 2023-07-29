// src/redux/actions/setSelectedNode.ts
import { Action } from 'redux';

export const SET_SELECTED_NODE = 'SET_SELECTED_NODE';

export interface SetSelectedNodeAction extends Action<typeof SET_SELECTED_NODE> {
  node: Node | null;
}

export const setSelectedNode = (node: Node | null): SetSelectedNodeAction => ({
  type: SET_SELECTED_NODE,
  node,
});