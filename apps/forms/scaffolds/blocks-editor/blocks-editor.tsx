"use client";

import React, { useCallback, useEffect, useId, useRef } from "react";
import { type EditorFlatFormBlock, DRAFT_ID_START_WITH } from "../editor/state";
import { useEditorState } from "../editor";
import {
  CodeIcon,
  DividerHorizontalIcon,
  HeadingIcon,
  ImageIcon,
  PlusCircledIcon,
  PlusIcon,
  ReaderIcon,
  SectionIcon,
  TextIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Block, BlocksCanvas } from "./blocks";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createClientFormsClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { FormBlockType } from "@/types";

export default function BlocksEditorRoot() {
  return (
    <DndContextProvider>
      <BlocksEditor />
    </DndContextProvider>
  );
}

function DndContextProvider({ children }: React.PropsWithChildren<{}>) {
  const [, dispatch] = useEditorState();

  const id = useId();

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.type === "section" && over?.type === "section") {
      event.over = null; // Prevent section over section
    }

    if (over && active.id !== over.id) {
      dispatch({
        type: "blocks/sort",
        block_id: active.id,
        over_id: over.id,
      });
    }
  }
}

function PendingBlocksResolver() {
  const [state, dispatch] = useEditorState();

  const supabase = createClientFormsClient();

  const insertBlock = useCallback(
    async (block: EditorFlatFormBlock) => {
      //
      const { data, error } = await supabase
        .from("form_block")
        .insert({
          data: {},
          form_id: state.form_id,
          type: block.type,
          form_page_id: state.page_id,
          parent_id: block.parent_id?.startsWith(DRAFT_ID_START_WITH)
            ? null
            : block.parent_id,
          local_index: block.local_index,
          form_field_id: block.form_field_id,
          body_html: block.body_html,
          src: block.src,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    [state.form_id, state.page_id, supabase]
  );

  useEffect(() => {
    // check for pending blocks, via id == PENDING_ID (Symbol)
    // create them on db, and update their id
    const pending_blocks = state.blocks.filter((block) =>
      block.id.startsWith(DRAFT_ID_START_WITH)
    );

    for (const block of pending_blocks) {
      insertBlock(block)
        .then((data) => {
          dispatch({
            type: "blocks/resolve",
            block_id: block.id,
            block: data,
          });
        })
        .catch((e) => {
          console.error("Failed to create block", e);
          toast.error("Failed to create block");
          dispatch({
            type: "blocks/delete",
            block_id: block.id,
          });
        });
    }
  }, [dispatch, insertBlock, state.blocks]);

  return <></>;
}

function useSyncBlocks(blocks: EditorFlatFormBlock[]) {
  // TODO: add debounce

  const supabase = createClientFormsClient();
  const prevBlocksRef = useRef(blocks);

  useEffect(() => {
    const prevBlocks = prevBlocksRef.current;
    const updatedBlocks = blocks.filter((block) => {
      const prevBlock = prevBlocks.find((prev) => prev.id === block.id);
      return (
        !prevBlock ||
        block.type !== prevBlock.type ||
        (block.parent_id !== prevBlock.parent_id &&
          // exclude from sync if parent_id is a draft (this can happen when a new section is created and blocks are assigned to it)
          !block.parent_id?.startsWith(DRAFT_ID_START_WITH)) ||
        block.local_index !== prevBlock.local_index ||
        block.form_field_id !== prevBlock.form_field_id ||
        block.title_html !== prevBlock.title_html ||
        block.description_html !== prevBlock.description_html ||
        block.body_html !== prevBlock.body_html ||
        block.src !== prevBlock.src
      );
    });

    updatedBlocks.forEach(async (block) => {
      try {
        const { data, error } = await supabase
          .from("form_block")
          .update({
            // Assuming these are the fields to update
            type: block.type,
            parent_id: block.parent_id,
            local_index: block.local_index,
            form_field_id: block.form_field_id,
            title_html: block.title_html,
            description_html: block.description_html,
            body_html: block.body_html,
            src: block.src,
            updated_at: new Date().toISOString(),
          })
          .eq("id", block.id)
          .single();

        if (error) throw new Error(error.message);
        // Handle successful update (e.g., through a dispatch or local state update)
      } catch (error) {
        console.error("Failed to update block:", error);
        // Handle error (e.g., rollback changes, show error message)
      }
    });

    // Update the ref to the current blocks for the next render
    prevBlocksRef.current = blocks;
  }, [blocks, supabase]);
}

function OptimisticBlocksSyncProvider({
  children,
}: React.PropsWithChildren<{}>) {
  // sync data to server, when blocks change. (use id as identifier)
  // look for differences in..
  // - type
  // - local_index
  // - form_field_id
  const [state] = useEditorState();

  // Use the custom hook to sync blocks
  useSyncBlocks(state.blocks);

  return <>{children}</>;
}

function BlocksEditor() {
  const [state, dispatch] = useEditorState();

  return (
    <div>
      <PendingBlocksResolver />
      <OptimisticBlocksSyncProvider />
      <div className="sticky top-20 z-10">
        <div className="absolute -left-6">
          <AddBlockButton />
        </div>
      </div>
      <BlocksCanvas id="root" className="flex flex-col gap-4 mt-10">
        <SortableContext
          items={state.blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {state.blocks.map((block) => {
            return (
              <div key={block.id}>
                <Block {...block} />
              </div>
            );
          })}
        </SortableContext>
      </BlocksCanvas>
    </div>
  );
}

function AddBlockButton() {
  const [state, dispatch] = useEditorState();

  const addBlock = useCallback(
    (block: FormBlockType) => {
      dispatch({
        type: "blocks/new",
        block: block,
      });
    },
    [dispatch]
  );

  const addSectionBlock = useCallback(() => addBlock("section"), [addBlock]);
  const addFieldBlock = useCallback(() => addBlock("field"), [addBlock]);
  const addHtmlBlock = useCallback(() => addBlock("html"), [addBlock]);
  const addDividerBlock = useCallback(() => addBlock("divider"), [addBlock]);
  const addHeaderBlock = useCallback(() => addBlock("header"), [addBlock]);
  const addImageBlock = useCallback(() => addBlock("image"), [addBlock]);
  const addVideoBlock = useCallback(() => addBlock("video"), [addBlock]);
  const addPdfBlock = useCallback(() => addBlock("pdf"), [addBlock]);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className="rounded-full w-12 h-12 flex items-center justify-center border bg-white dark:bg-neutral-800 dark:border-neutral-700 p-2">
          <PlusIcon />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 flex flex-col rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg p-4 gap-2"
          align="start"
        >
          <BlockItem onClick={addFieldBlock}>
            <PlusCircledIcon />
            Field
          </BlockItem>
          <BlockItem onClick={addImageBlock}>
            <ImageIcon />
            Image
          </BlockItem>
          <BlockItem onClick={addVideoBlock}>
            <VideoIcon />
            Video
          </BlockItem>
          <BlockItem onClick={addHtmlBlock}>
            <CodeIcon />
            HTML
          </BlockItem>
          <BlockItem onClick={addPdfBlock}>
            <ReaderIcon />
            Pdf
          </BlockItem>
          <BlockItem onClick={addDividerBlock}>
            <DividerHorizontalIcon />
            Divider
          </BlockItem>
          <BlockItem onClick={addSectionBlock}>
            <SectionIcon />
            Section
          </BlockItem>
          <BlockItem onClick={addHeaderBlock}>
            <HeadingIcon />
            Header
          </BlockItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function BlockItem({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Item>) {
  return (
    <DropdownMenu.Item
      {...props}
      className="flex gap-2 items-center p-1 cursor-pointer"
    >
      {children}
    </DropdownMenu.Item>
  );
}
