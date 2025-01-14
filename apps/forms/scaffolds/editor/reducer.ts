import { produce } from "immer";
import { EditorFlatFormBlock, FormEditorState } from "./state";
import {
  BlockDescriptionAction,
  BlockTitleAction,
  BlocksEditorAction,
  ChangeBlockFieldAction,
  CreateFielFromBlockdAction,
  CreateNewPendingBlockAction,
  DeleteBlockAction,
  DeleteFieldAction,
  DeleteResponseAction,
  DeleteSelectedResponsesAction,
  FeedResponseAction,
  FocusFieldAction,
  HtmlBlockBodyAction,
  ImageBlockSrcAction,
  OpenCustomerEditAction,
  OpenEditFieldAction,
  OpenResponseEditAction,
  ResolvePendingBlockAction,
  ResponseFeedRowsAction,
  SaveFieldAction,
  SelectResponse,
  SortBlockAction,
  VideoBlockSrcAction,
} from "./action";
import { arrayMove } from "@dnd-kit/sortable";
import { blockstreeflat } from "@/lib/forms/tree";
import { HTML_BLOCK_BODY_HTML_DEFAULT_VALUE } from "@/k/html_block_defaults";
import { VIDEO_BLOCK_SRC_DEFAULT_VALUE } from "@/k/video_block_defaults";
import { IMAGE_BLOCK_SRC_DEFAULT_VALUE } from "@/k/image_block_defaults";
import { PDF_BLOCK_SRC_DEFAULT_VALUE } from "@/k/pdf_block_defaults";
import { draftid } from "@/utils/id";

export function reducer(
  state: FormEditorState,
  action: BlocksEditorAction
): FormEditorState {
  switch (action.type) {
    case "blocks/new": {
      // TODO: if adding new section, if there is a present non-section-blocks on root, it should automatically be nested under new section.
      const { block } = <CreateNewPendingBlockAction>action;

      const new_index = state.blocks.length;

      // find the last parent section
      const parent_section = state.blocks
        .filter((block) => block.type === "section")
        .sort((a, b) => b.local_index - a.local_index)[0];
      const parent_id = parent_section?.id ?? null;
      const id = draftid();

      const __shared: EditorFlatFormBlock = {
        id,
        created_at: new Date().toISOString(),
        form_id: state.form_id,
        form_page_id: state.page_id,
        parent_id: block === "section" ? null : parent_id,
        type: block,
        local_index: new_index,
        data: {},
      };

      switch (block) {
        case "field": {
          return produce(state, (draft) => {
            const { available_field_ids } = state;

            // find unused field id (if any)
            const field_id = available_field_ids[0] ?? null;

            draft.blocks.push({
              ...__shared,
              form_field_id: field_id,
            });

            // remove the field id from available_field_ids
            draft.available_field_ids = available_field_ids.filter(
              (id) => id !== field_id
            );

            // update focus block id
            draft.focus_block_id = id;

            if (!field_id) {
              // if no available field, but field block provided, open a field editor panel
              draft.focus_field_id = null;
              draft.is_field_edit_panel_open = true;
              //
            }
          });
        }
        case "section": {
          return produce(state, (draft) => {
            const id = __shared.id;

            // section can be placed on root only.
            // if there were no section on root, the existing blocks should be nested under the new section.
            const section_blocks = draft.blocks.filter(
              (block) => block.type === "section" && block.parent_id === null
            );

            if (section_blocks.length === 0) {
              draft.blocks.forEach((block) => {
                block.parent_id = id;
              });
            }

            const new_blocks = blockstreeflat(
              draft.blocks.concat({
                ...__shared,
              })
            );

            draft.blocks = new_blocks;
          });
        }
        case "html": {
          return produce(state, (draft) => {
            draft.blocks.push({
              ...__shared,
              body_html: HTML_BLOCK_BODY_HTML_DEFAULT_VALUE,
            });
          });
        }
        case "image": {
          return produce(state, (draft) => {
            draft.blocks.push({
              ...__shared,
              src: IMAGE_BLOCK_SRC_DEFAULT_VALUE,
            });
          });
        }
        case "video": {
          return produce(state, (draft) => {
            draft.blocks.push({
              ...__shared,
              src: VIDEO_BLOCK_SRC_DEFAULT_VALUE,
            });
          });
        }
        case "pdf": {
          return produce(state, (draft) => {
            draft.blocks.push({
              ...__shared,
              src: PDF_BLOCK_SRC_DEFAULT_VALUE,
            });
          });
        }
        case "divider": {
          return produce(state, (draft) => {
            draft.blocks.push({
              ...__shared,
            });
          });
        }
        case "header": {
          return produce(state, (draft) => {
            draft.blocks.push({
              ...__shared,
              title_html: "Header",
              description_html: "Description",
            });
          });
        }
        default: {
          throw new Error("Unsupported block type : " + block);
        }
      }
    }
    case "blocks/resolve": {
      const { block_id, block } = <ResolvePendingBlockAction>action;

      const old_id = block_id;
      const new_id = block.id;

      return produce(state, (draft) => {
        const index = draft.blocks.findIndex((b) => b.id === block_id);
        if (index !== -1) {
          // update the whole block with the resolved block
          draft.blocks[index] = block;
        }

        // update focus block id if updated
        if ((draft.focus_block_id = old_id)) {
          draft.focus_block_id = new_id;
        }

        // when resolved, the id is updated to the real id.
        // other references to previous id should be updated as well.
        // currently we have only parent_id to update.
        draft.blocks.forEach((b) => {
          if (b.parent_id === old_id) {
            b.parent_id = new_id;
          }
        });
      });
    }
    case "blocks/delete": {
      const { block_id } = <DeleteBlockAction>action;
      console.log("delete block", block_id);
      return produce(state, (draft) => {
        // remove the field id from available_field_ids
        draft.blocks = draft.blocks.filter((block) => block.id !== block_id);

        // find the field_id of the deleted block
        const field_id = state.blocks.find(
          (b) => b.id === block_id
        )?.form_field_id;
        // add the field_id to available_field_ids
        if (field_id) {
          draft.available_field_ids.push(field_id);
        }
      });
    }
    case "blocks/title": {
      const { block_id, title_html } = <BlockTitleAction>action;
      return produce(state, (draft) => {
        const block = draft.blocks.find((b) => b.id === block_id);
        if (block) {
          block.title_html = title_html;
        }
      });
    }
    case "blocks/description": {
      const { block_id, description_html } = <BlockDescriptionAction>action;
      return produce(state, (draft) => {
        const block = draft.blocks.find((b) => b.id === block_id);
        if (block) {
          block.description_html = description_html;
        }
      });
    }
    case "blocks/field/new": {
      const { block_id } = <CreateFielFromBlockdAction>action;
      // trigger new field from empty field block
      return produce(state, (draft) => {
        // update focus block id
        draft.focus_block_id = block_id;

        // if no available field, but field block provided, open a field editor panel
        draft.focus_field_id = null;
        draft.is_field_edit_panel_open = true;
      });
    }
    case "blocks/field/change": {
      const { block_id, field_id } = <ChangeBlockFieldAction>action;
      return produce(state, (draft) => {
        const block = draft.blocks.find((b) => b.id === block_id);
        if (block) {
          const previous_field_id = block.form_field_id;
          block.form_field_id = field_id;

          // update the available_field_ids
          draft.available_field_ids = [
            ...draft.available_field_ids.filter((id) => id !== field_id),
            previous_field_id,
          ].filter(Boolean) as string[];
        }
      });
    }
    case "blocks/html/body": {
      const { block_id, html } = <HtmlBlockBodyAction>action;
      return produce(state, (draft) => {
        const block = draft.blocks.find((b) => b.id === block_id);
        console.log("html block body", block_id, html);
        if (block && block.type === "html") {
          block.body_html = html;
        }
      });
    }
    case "blocks/image/src": {
      const { block_id, src } = <ImageBlockSrcAction>action;
      return produce(state, (draft) => {
        const block = draft.blocks.find((b) => b.id === block_id);
        if (block && block.type === "image") {
          block.src = src;
        }
      });
    }
    case "blocks/video/src": {
      const { block_id, src } = <VideoBlockSrcAction>action;
      return produce(state, (draft) => {
        const block = draft.blocks.find((b) => b.id === block_id);
        if (block && block.type === "video") {
          block.src = src;
        }
      });
    }
    case "blocks/sort": {
      const { block_id, over_id } = <SortBlockAction>action;
      return produce(state, (draft) => {
        if (over_id === "root") {
          const blockIndex = draft.blocks.findIndex(
            (block) => block.id === block_id
          );
          if (blockIndex > -1) {
            // DO NOT ALLOW THIS ACTION. this is not hanlded yet. (item exiting section)
            // Assign to root if moved above the first section
            // draft.blocks[blockIndex].parent_id = null;
          }
          return;
        }

        const oldIndex = draft.blocks.findIndex(
          (block) => block.id === block_id
        );
        const newIndex = draft.blocks.findIndex(
          (block) => block.id === over_id
        );

        // Ensure arrayMove returns a new array with objects that can be mutated
        let movedBlocks = arrayMove(draft.blocks, oldIndex, newIndex);

        // Re-assign draft.blocks to ensure the objects are treated as new if necessary
        draft.blocks = movedBlocks.map((block, index) => ({
          ...block,
          local_index: index,
        }));

        // Update parent_id based on the new position
        const movedBlock = draft.blocks.find((block) => block.id === block_id);
        if (movedBlock) {
          // Find the nearest section/group above the moved block
          let newParentId: string | null = null;
          for (let i = newIndex - 1; i >= 0; i--) {
            if (["section", "group"].includes(draft.blocks[i].type)) {
              newParentId = draft.blocks[i].id;
              break;
            }
          }

          if (!newParentId) {
            // DO NOT ALLOW PARENT ID TO BE NULL IF THERE IS A SECTION PRESENT.
            const section = draft.blocks.find(
              (block) => block.type === "section"
            );
            if (section) {
              // BLOCK THIS ACTION
              // revert the move
              draft.blocks = arrayMove(draft.blocks, newIndex, oldIndex);
              return;
            }
          }
          movedBlock.parent_id = newParentId;
        }
      });
    }

    case "editor/field/focus": {
      const { field_id } = <FocusFieldAction>action;
      return produce(state, (draft) => {
        draft.focus_field_id = field_id;
      });
    }
    case "editor/field/edit": {
      const { field_id, open, refresh } = <OpenEditFieldAction>action;
      return produce(state, (draft) => {
        draft.is_field_edit_panel_open = open ?? true;
        draft.focus_field_id = field_id;
        if (refresh) {
          draft.field_edit_panel_refresh_key =
            (draft.field_edit_panel_refresh_key ?? 0) + 1;
        }
      });
    }
    case "editor/field/save": {
      const { field_id, data } = <SaveFieldAction>action;
      return produce(state, (draft) => {
        const field = draft.fields.find((f) => f.id === field_id);
        if (field) {
          field.id = field_id;
          field.name = data.name;
          field.label = data.label;
          field.placeholder = data.placeholder;
          field.help_text = data.help_text;
          field.type = data.type;
          field.required = data.required;
          field.pattern = data.pattern;
          field.options = data.options;
          field.autocomplete = data.autocomplete;
          field.data = data.data;
          field.accept = data.accept;
          field.multiple = data.multiple;
        } else {
          // create new field
          draft.fields.push({
            ...data,
          });

          let unused_field_id: string | null = field_id;

          // if new field, and focus block has no assigned field, use this.
          if (draft.focus_block_id) {
            const block = draft.blocks.find(
              (d) => d.id == draft.focus_block_id
            );

            if (block && block.type === "field" && !block.form_field_id) {
              block.form_field_id = unused_field_id;
              unused_field_id = null;
            }
          }

          // add the field_id to available_field_ids
          if (unused_field_id) draft.available_field_ids.push(unused_field_id);
        }
        //
      });
    }
    case "editor/field/delete": {
      const { field_id } = <DeleteFieldAction>action;
      return produce(state, (draft) => {
        // remove from fields
        draft.fields = draft.fields.filter((f) => f.id !== field_id);

        // remove from available_field_ids
        draft.available_field_ids = draft.available_field_ids.filter(
          (id) => id !== field_id
        );

        // set empty to referenced blocks
        draft.blocks = draft.blocks.map((block) => {
          if (block.form_field_id === field_id) {
            block.form_field_id = null;
          }
          return block;
        });
      });
    }
    case "editor/response/select": {
      const { selection } = <SelectResponse>action;
      return produce(state, (draft) => {
        draft.selected_responses = new Set(selection);
      });
    }
    case "editor/response/delete/selected": {
      const {} = <DeleteSelectedResponsesAction>action;
      return produce(state, (draft) => {
        const ids = Array.from(state.selected_responses);

        draft.responses = draft.responses?.filter(
          (response) => !ids.includes(response.id)
        );

        // also remove from selected_responses
        const new_selected_responses = new Set(state.selected_responses);
        ids.forEach((id) => {
          new_selected_responses.delete(id);
        });

        draft.selected_responses = new_selected_responses;
      });
    }
    case "editor/response/delete": {
      const { id } = <DeleteResponseAction>action;
      return produce(state, (draft) => {
        draft.responses = draft.responses?.filter(
          (response) => response.id !== id
        );

        // also remove from selected_responses
        const new_selected_responses = new Set(state.selected_responses);
        new_selected_responses.delete(id);

        draft.selected_responses = new_selected_responses;
      });
    }
    case "editor/responses/pagination/rows": {
      const { max } = <ResponseFeedRowsAction>action;
      return produce(state, (draft) => {
        draft.responses_pagination_rows = max;
      });
    }
    case "editor/response/feed": {
      const { data, reset } = <FeedResponseAction>action;
      return produce(state, (draft) => {
        // Initialize draft.responses if it's not already an array
        if (!Array.isArray(draft.responses)) {
          draft.responses = [];
        }

        if (reset) {
          draft.responses = data;
          return;
        }

        // Merge & Add new responses to the existing responses
        // Map of ids to responses for the existing responses
        const existingResponsesById = draft.responses.reduce(
          (acc: any, response) => {
            acc[response.id] = response;
            return acc;
          },
          {}
        );

        data.forEach((newResponse) => {
          if (existingResponsesById.hasOwnProperty(newResponse.id)) {
            // Update existing response
            Object.assign(
              (existingResponsesById as any)[newResponse.id],
              newResponse
            );
          } else {
            // Add new response if id does not exist
            draft.responses!.push(newResponse);
          }
        });
      });
    }
    case "editor/responses/edit": {
      const { response_id, open } = <OpenResponseEditAction>action;
      return produce(state, (draft) => {
        draft.is_response_edit_panel_open = open ?? true;
        draft.focus_response_id = response_id;
      });
    }
    case "editor/customers/edit": {
      const { customer_id, open } = <OpenCustomerEditAction>action;
      return produce(state, (draft) => {
        draft.is_customer_edit_panel_open = open ?? true;
        draft.focus_customer_id = customer_id;
      });
    }
    default:
      return state;
  }
}
