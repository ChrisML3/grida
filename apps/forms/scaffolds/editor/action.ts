import { FormBlockType, FormFieldDefinition, NewFormFieldInit } from "@/types";

export type BlocksEditorAction =
  | CreateNewBlockAction
  | DeleteBlockAction
  | OpenEditFieldAction
  | SortBlockAction
  | FocusFieldAction
  | ChangeBlockFieldAction
  | SaveFieldAction
  | FeedResponseAction
  | ResponseFeedRowsAction;

export interface CreateNewBlockAction {
  type: "blocks/new";
  block: FormBlockType;
}

export interface DeleteBlockAction {
  type: "blocks/delete";
  block_id: string;
}

export interface SortBlockAction {
  type: "blocks/sort";
  block_id: string;
  over_id: string;
}

export interface ChangeBlockFieldAction {
  type: "blocks/field/change";
  block_id: string;
  field_id: string;
}

export interface FocusFieldAction {
  type: "editor/field/focus";
  field_id: string;
}

export interface OpenEditFieldAction {
  type: "editor/field/edit";
  field_id?: string;
  // true by default
  open?: boolean;
  refresh?: boolean;
}

export interface SaveFieldAction {
  type: "editor/field/save";
  field_id: string;
  data: FormFieldDefinition;
}

export interface FeedResponseAction {
  type: "editor/response/feed";
  data: any[];
}

export interface ResponseFeedRowsAction {
  type: "editor/responses/pagination/rows";
  max: number;
}