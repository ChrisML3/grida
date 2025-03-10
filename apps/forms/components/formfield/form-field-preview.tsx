import { FormFieldDataSchema, FormFieldType, PaymentFieldData } from "@/types";
import React, { useEffect, useState } from "react";
import { Select as HtmlSelect } from "../vanilla/select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignatureCanvas } from "../signature-canvas";
import { StripePaymentFormFieldPreview } from "./form-field-preview-payment-stripe";
import { TossPaymentsPaymentFormFieldPreview } from "./form-field-preview-payment-tosspayments";
import clsx from "clsx";
import { ClockIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import useSafeSelectValue from "./use-safe-select-value";

/**
 * this disables the auto zoom in input text tag safari on iphone by setting font-size to 16px
 * @see https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone
 */
const cls_input_ios_zoom_disable = "!text-base sm:!text-sm";

export function FormFieldPreview({
  name,
  label,
  labelCapitalize,
  type,
  placeholder,
  required,
  defaultValue,
  options,
  helpText,
  readonly,
  disabled,
  autoComplete,
  accept,
  multiple,
  pattern,
  data,
  novalidate,
  vanilla,
  locked,
  preview,
}: {
  name: string;
  label?: string;
  type: FormFieldType;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  defaultValue?: string;
  options?: {
    id?: string;
    label?: string | null;
    value: string;
    disabled?: boolean | null;
  }[];
  pattern?: string;
  readonly?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  accept?: string;
  multiple?: boolean;
  labelCapitalize?: boolean;
  data?: FormFieldDataSchema | null;
  novalidate?: boolean;
  /**
   * use vanilla html5 input element only
   */
  vanilla?: boolean;
  /**
   * disable auto mutation of value when locked.
   * by default, the input values are only modified by user input, thus, there is a exception for select input for extra validation (e.g. useSafeSelectValue)
   */
  locked?: boolean;
  /**
   * force render invisible field if true
   */
  preview?: boolean;
}) {
  const sharedInputProps:
    | React.ComponentProps<"input">
    | React.ComponentProps<"textarea"> = {
    id: name,
    name: name,
    readOnly: readonly,
    disabled: disabled,
    autoFocus: false,
    placeholder: placeholder,
    autoComplete,
    accept,
    multiple,
    defaultValue: defaultValue,
    // form validation related
    required: novalidate ? false : required,
    pattern: novalidate ? undefined : pattern || undefined,
    // minLength: novalidate ? undefined : data?.min_length,
    // maxLength: novalidate ? undefined : data?.max_length,
    // min: novalidate ? undefined : data?.min,
    // max: novalidate ? undefined : data?.max,
    // step: novalidate ? undefined : data?.step,
  };

  function renderInput() {
    switch (type) {
      case "textarea": {
        return (
          <HtmlTextarea
            {...(sharedInputProps as React.ComponentProps<"textarea">)}
          />
        );
      }
      case "file": {
        return (
          <HtmlFileInput
            {...(sharedInputProps as React.ComponentProps<"input">)}
          />
        );
      }
      case "select": {
        if (vanilla) {
          // html5 vanilla select
          return (
            <HtmlSelectWithSafeValue
              {...(sharedInputProps as React.ComponentProps<"select">)}
              options={options}
              locked={locked}
            />
          );
        } else {
          if (multiple) {
            // TODO:
            return (
              <>invalid - non vanilla select cannot have property multiple</>
            );
          }

          return (
            <SelectWithSafeValue
              {...(sharedInputProps as React.ComponentProps<"select">)}
              options={options}
              locked={locked}
            />
          );
        }
      }
      case "radio": {
        return (
          <fieldset>
            {options?.map((option) => (
              <div className="flex items-center gap-2" key={option.value}>
                <input
                  type="radio"
                  name={name}
                  id={option.value}
                  value={option.value}
                  {...(sharedInputProps as React.ComponentProps<"input">)}
                />
                <label
                  htmlFor={option.value}
                  className="ms-2 text-sm font-medium text-neutral-900 dark:text-neutral-300"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </fieldset>
        );
      }
      case "checkbox": {
        return (
          // @ts-ignore
          <Checkbox {...(sharedInputProps as React.ComponentProps<"input">)} />
        );
      }
      case "checkboxes": {
        return (
          <fieldset className="not-prose">
            <ul className="text-sm font-medium text-neutral-900 bg-white border border-neutral-200 rounded-lg dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
              {options?.map((option) => (
                <li
                  key={option.value}
                  className="w-full border-b border-neutral-200 rounded-t-lg dark:border-neutral-600"
                >
                  <div className="flex items-center ps-3">
                    <input
                      type="checkbox"
                      name={name}
                      id={option.value}
                      value={option.value}
                      {...(sharedInputProps as React.ComponentProps<"input">)}
                      className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-700 dark:focus:ring-offset-neutral-700 focus:ring-2 dark:bg-neutral-600 dark:border-neutral-500"
                    />
                    <label
                      htmlFor={option.value}
                      className="w-full py-3 ms-2 text-sm font-medium text-neutral-900 dark:text-neutral-300"
                    >
                      {option.label}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </fieldset>
        );
      }
      case "time": {
        return (
          <div className="relative">
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
              <ClockIcon />
            </div>
            <input
              type="time"
              className="bg-neutral-50 border leading-none border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...(sharedInputProps as React.ComponentProps<"input">)}
            />
          </div>
        );
      }
      case "color": {
        return (
          <input
            type="color"
            {...(sharedInputProps as React.ComponentProps<"input">)}
          />
        );
      }
      case "signature": {
        return (
          // TODO: this is not accepted by form.
          <SignatureCanvas
            {...(sharedInputProps as React.ComponentProps<"input">)}
          />
        );
      }
      default: {
        return (
          <HtmlInput
            type={type}
            {...(sharedInputProps as React.ComponentProps<"input">)}
          />
        );
      }
    }
  }

  if (type === "hidden") {
    if (preview) {
      // TODO: improve me
      return <p>hidden field - {name}</p>;
    }

    return <input type="hidden" name={name} defaultValue={defaultValue} />;
  }

  if (type === "payment") {
    return <PaymentField data={data as PaymentFieldData} disabled={disabled} />;
  }

  const LabelText = () => (
    <label
      data-capitalize={labelCapitalize}
      htmlFor={name}
      className="data-[capitalize]:capitalize font-medium text-neutral-900 dark:text-neutral-300 text-sm"
    >
      {label || name}
    </label>
  );

  const HelpText = () =>
    helpText ? (
      <span className="text-sm text-neutral-400 dark:text-neutral-600">
        {helpText}
      </span>
    ) : (
      <></>
    );

  switch (type) {
    case "checkbox": {
      return (
        <div className="items-top flex space-x-2">
          {renderInput()}
          <div className="grid gap-1.5 leading-none">
            <LabelText />
            <HelpText />
          </div>
        </div>
      );
    }
    case "checkboxes": {
      return (
        <label
          htmlFor={"none"} // disable the focusing since checkboxes is not standard form input
          data-field-type={type}
          className="flex flex-col gap-1"
        >
          <LabelText />
          <HelpText />
          {renderInput()}
        </label>
      );
    }
  }

  return (
    <label data-field-type={type} className="flex flex-col gap-1">
      <LabelText />
      {renderInput()}
      <HelpText />
    </label>
  );
}

/**
 * This is for Select component to automatically de-select the selected item when the selected option is disabled.
 */
function SelectWithSafeValue({
  options: _options,
  locked,
  ...inputProps
}: React.ComponentProps<"select"> & {
  placeholder?: string;
  options?: {
    id?: string;
    label?: string | null;
    value: string;
    disabled?: boolean | null;
  }[];
} & {
  locked?: boolean;
}) {
  const {
    value: _value,
    defaultValue: _defaultValue,
    placeholder,
  } = inputProps;

  const { value, defaultValue, options, setValue } = useSafeSelectValue({
    value: _value as string,
    options: _options?.map((option) => ({
      // map value to id if id exists
      value: option.id || option.value,
      label: option.label || option.value,
      disabled: option.disabled,
    })),
    // TODO: this should be true to display placeholder when changed to disabled, but this won't work for reason.
    // leaving it as false for now.
    useUndefined: false,
    // TODO: also, for smae reason setting the default value to ''
    defaultValue: (_defaultValue || "") as string,
    locked,
  });

  return (
    // shadcn select
    // @ts-ignore
    <Select
      {...(inputProps as React.ComponentProps<"select">)}
      // this is required, unless, the real native select won't change and fail to validate accurately
      key={value}
      value={value || undefined}
      // TODO: same reason, disabling defaultValue to display placeholder
      defaultValue={(defaultValue || undefined) as string}
      onValueChange={setValue}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled || false}
          >
            {option.label || option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * This is for Select component to automatically de-select the selected item when the selected option is disabled.
 */
function HtmlSelectWithSafeValue({
  options: _options,
  locked,
  ...inputProps
}: React.ComponentProps<"select"> & {
  placeholder?: string;
  options?: {
    id?: string;
    label?: string | null;
    value: string;
    disabled?: boolean | null;
  }[];
} & {
  locked?: boolean;
}) {
  const {
    value: _value,
    defaultValue: _defaultValue,
    placeholder,
    required,
  } = inputProps;

  const { value, defaultValue, setValue, options } = useSafeSelectValue({
    value: _value as string,
    defaultValue: _defaultValue as string,
    options: _options?.map((option) => ({
      // map value to id if id exists
      value: option.id || option.value,
      label: option.label || option.value,
      disabled: option.disabled,
    })),
    locked,
  });

  // html5 vanilla select
  return (
    <HtmlSelect
      {...(inputProps as React.ComponentProps<"select">)}
      value={value || undefined}
      defaultValue={defaultValue || ""}
      onChange={(e) => {
        setValue(e.target.value as string);
      }}
    >
      {placeholder && (
        <option value="" disabled={!locked && required}>
          {placeholder}
        </option>
      )}
      {options?.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled || false}
        >
          {option.label}
        </option>
      ))}
    </HtmlSelect>
  );
}

function HtmlTextarea({ ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={clsx(
        "block p-2.5 w-full text-sm text-neutral-900 bg-neutral-50 rounded-lg border border-neutral-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        cls_input_ios_zoom_disable
      )}
      {...props}
    />
  );
}

function HtmlInput({ ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={clsx(
        "bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        cls_input_ios_zoom_disable
      )}
      {...props}
    />
  );
}

function HtmlFileInput({ ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="file"
      className="
        text-sm text-stone-500
        file:mr-5 file:py-1 file:px-3
        file:rounded file:border-none
        file:text-xs file:font-medium
        file:bg-stone-50 file:text-stone-700
        hover:file:cursor-pointer hover:file:bg-blue-50
        hover:file:text-blue-700
      "
      {...props}
    />
  );
}

function PaymentField({
  data,
  disabled,
}: {
  data?: PaymentFieldData;
  disabled?: boolean;
}) {
  switch (data?.service_provider) {
    case "stripe":
      return <StripePaymentFormFieldPreview />;
    case "tosspayments":
      return <TossPaymentsPaymentFormFieldPreview disabled={disabled} />;
    default:
      return <StripePaymentFormFieldPreview />;
  }
}
