"use client";

import "react-data-grid/lib/styles.css";
import DataGrid, {
  Column,
  RenderCellProps,
  RenderEditCellProps,
  RenderHeaderCellProps,
} from "react-data-grid";
import {
  PlusIcon,
  ChevronDownIcon,
  EnvelopeClosedIcon,
  TextIcon,
  ImageIcon,
} from "@radix-ui/react-icons";

export function Grid({
  columns,
  rows,
}: {
  columns: {
    key: string;
    name: string;
    type?: string;
  }[];
  rows: { __id: string; [key: string]: string | number | boolean }[];
}) {
  const __leading_column: Column<any> = {
    key: "__",
    name: "",
    frozen: true,
    width: 50,
    renderHeaderCell: LeadingHeaderCell,
  };

  const __id_column: Column<any> = {
    key: "__gf_id",
    name: "id",
    frozen: true,
    resizable: true,
    width: 100,
    renderHeaderCell: DefaultPropertyHeaderCell,
  };

  const __created_at_column: Column<any> = {
    key: "__gf_created_at",
    name: "time",
    frozen: true,
    resizable: true,
    width: 100,
    renderHeaderCell: DefaultPropertyHeaderCell,
  };

  const __new_column: Column<any> = {
    key: "__gf_new",
    name: "+",
    resizable: false,
    draggable: true,
    width: 100,
    renderHeaderCell: NewFieldHeaderCell,
  };

  const formattedColumns = [__leading_column, __id_column, __created_at_column]
    .concat(
      columns.map(
        (col) =>
          ({
            key: col.key,
            name: col.name,
            resizable: true,
            draggable: true,
            editable: true,
            width: undefined,
            renderHeaderCell: FieldHeaderCell,
            renderCell: FieldCell,
            renderEditCell: FieldEditCell,
          }) as Column<any>
      )
    )
    .concat(__new_column);

  return (
    <DataGrid
      className="border border-gray-200 h-max select-none"
      columns={formattedColumns}
      rows={rows}
    />
  );
}

function LeadingHeaderCell({ column }: RenderHeaderCellProps<any>) {
  return <div></div>;
}

function LeadingCell({ column }: RenderHeaderCellProps<any>) {
  return <div></div>;
}

function DefaultPropertyHeaderCell({ column }: RenderHeaderCellProps<any>) {
  const { name } = column;
  return <div>{name}</div>;
}

function FieldHeaderCell({ column }: RenderHeaderCellProps<any>) {
  const { name } = column;

  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <TextIcon />
        {name}
      </span>
      <button>
        <ChevronDownIcon />
      </button>
    </div>
  );
}

function NewFieldHeaderCell({}: RenderHeaderCellProps<any>) {
  return (
    <button className="rounded p-2 bg-neutral-100 w-full flex items-center justify-center">
      <PlusIcon />
    </button>
  );
}

function FieldCell({ column, row }: RenderCellProps<any>) {
  const data = row[column.key];

  if (!data) {
    return <></>;
  }

  const { type, value } = data;

  const unwrapped = JSON.parse(value);

  let display = "";
  switch (type) {
    case "text":
      display = unwrapped;
      break;
  }

  return <div>{unwrapped}</div>;
}

function FieldEditCell({ column, row }: RenderEditCellProps<any>) {
  const data = row[column.key];

  if (!data) {
    return <></>;
  }

  const { type, value } = data;

  const unwrapped = JSON.parse(value);

  switch (type) {
    case "text":
      return <input type="text" defaultValue={unwrapped} />;
    case "select":
      return <select></select>;
  }
}