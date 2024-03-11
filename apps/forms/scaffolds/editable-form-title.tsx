"use client";

import { createClientClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState, useEffect, useCallback } from "react";

export function EditableFormTitle({
  form_id,
  defaultValue,
}: {
  form_id: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState<string>(defaultValue || "");

  const supabase = createClientClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTitle = useCallback(
    debounce(async (newValue: string) => {
      console.log("updateTitle", newValue);
      const { error } = await supabase
        .from("form")
        .update({ title: newValue })
        .eq("id", form_id);

      if (error) {
        console.error(error);
      }
    }, 500), // 500ms debounce period

    [form_id, supabase]
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
  };

  useEffect(() => {
    if (value !== defaultValue) {
      updateTitle(value);
    }
  }, [defaultValue, value, updateTitle]);

  return (
    <input
      className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      type="text"
      value={value}
      onChange={onChange}
    />
  );
}

function debounce<F extends (...args: any[]) => void>(
  func: F,
  wait: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<F>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}