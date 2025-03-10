import type { MutableInventoryStock } from "./inventory";

type UUID = string;

export interface Form {
  created_at: string;
  custom_preview_url_path: string | null;
  custom_publish_url_path: string | null;
  default_form_page_id: string | null;
  default_form_page_language: FormsPageLanguage;
  description: string | null;
  id: string;
  is_edit_after_submission_allowed: boolean;
  is_max_form_responses_by_customer_enabled: boolean;
  is_max_form_responses_in_total_enabled: boolean;
  is_multiple_response_allowed: boolean;
  is_powered_by_branding_enabled: boolean;
  is_redirect_after_response_uri_enabled: boolean;
  max_form_responses_by_customer: number | null;
  max_form_responses_in_total: number | null;
  project_id: number;
  redirect_after_response_uri: string | null;
  title: string;
  unknown_field_handling_strategy: FormResponseUnknownFieldHandlingStrategyType;
  updated_at: string;
}

/**
 * user facing page language
 */
export type FormsPageLanguage =
  | "en"
  | "es"
  | "de"
  | "ja"
  | "fr"
  | "pt"
  | "it"
  | "ko"
  | "ru"
  | "zh"
  | "ar"
  | "hi"
  | "nl";

export type FormResponseUnknownFieldHandlingStrategyType =
  | "accept"
  | "ignore"
  | "reject";

export type FormFieldType =
  | "text"
  | "textarea"
  | "tel"
  | "url"
  | "checkbox"
  | "checkboxes"
  | "number"
  | "date"
  | "datetime-local"
  | "month"
  | "week"
  | "time"
  | "email"
  | "file"
  | "image"
  | "select"
  | "latlng"
  | "password"
  | "color"
  | "radio"
  | "country"
  | "payment"
  | "hidden"
  | "signature";

export type FormFieldAutocompleteType =
  | "off"
  | "on"
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  | "email"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "organization-title"
  | "organization"
  | "street-address"
  | "shipping"
  | "billing"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-extension"
  | "impp"
  | "url"
  | "photo"
  | "webauthn";

export type PlatformPoweredBy = "api" | "grida_forms" | "web_client";

export type FormFieldInit = {
  id?: string;
  name: string;
  label: string;
  type: FormFieldType;
  placeholder: string;
  required: boolean;
  help_text: string;
  pattern?: string;
  options?: Option[];
  autocomplete?: FormFieldAutocompleteType[] | null;
  data?: FormFieldDataSchema | null;
  accept?: string | null;
  multiple?: boolean;
  // options_inventory?: { [option_id: string]: MutableInventoryStock };
};

export interface IFormField {
  name: string;
  label?: string | null;
  type: FormFieldType;
  placeholder?: string | null;
  required: boolean;
  help_text?: string | null;
  pattern?: any | null;
  options?: Option[];
  autocomplete?: FormFieldAutocompleteType[] | null;
  data?: FormFieldDataSchema | null;
  accept?: string | null;
  multiple?: boolean | null;
}

export interface FormFieldDefinition extends IFormField {
  id: UUID;
}

export interface FormPage {
  id: string;
  form_id: string;
  name: string;
  blocks: FormBlock[];
  background?: FormPageBackgroundSchema;
  stylesheet?: any;
}

export interface FormBlock<T = FormBlockType> {
  id: string;
  form_id: string;
  form_field_id?: string | null;
  form_page_id: string | null;
  type: T;
  title_html?: string | null;
  description_html?: string | null;
  body_html?: string | null;
  src?: string | null;
  data: any;
  created_at: string;
  parent_id?: string | null;
  local_index: number;
}

export type Option = {
  id: string;
  label?: string;
  value: string;
  disabled?: boolean | null;
  index?: number;
};

export type FormBlockType =
  | "section"
  | "field"
  | "image"
  | "video"
  | "html"
  | "divider"
  | "header"
  | "pdf"
  // not supported yet
  | "group";
// not supported yet
// | "layout"

export interface FormResponse {
  id: string;
  local_id: number;
  browser: string | null;
  created_at: string;
  customer_id: string | null;
  form_id: string | null;
  ip: string | null;
  platform_powered_by: PlatformPoweredBy | null;
  raw: any;
  updated_at: string;
  x_referer: string | null;
  x_useragent: string | null;
  fields?: FormResponseField[];
}

export interface FormResponseField {
  id: string;
  created_at: string;
  form_field_id: string;
  response_id: string;
  type: FormFieldType;
  updated_at: string;
  value: any;
}

export type FormFieldDataSchema = PaymentFieldData | {};

export type PaymentsServiceProviders = "stripe" | "tosspayments";

export interface PaymentFieldData {
  type: "payment";
  service_provider: PaymentsServiceProviders;
}

export type FormPageBackgroundSchema = FormPageThemeEmbeddedBackgroundData;

interface FormPageThemeEmbeddedBackgroundData {
  type: "background";
  element: "iframe" | "img" | "div";
  /**
   * allowed for iframe, img
   */
  src?: string;
  /**
   * allowed for all
   */
  "background-color"?: string;
}
