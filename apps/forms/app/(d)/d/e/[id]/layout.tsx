import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import i18next from "i18next";

const inter = Inter({ subsets: ["latin"] });

const IS_PRODUTION = process.env.NODE_ENV === "production";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient(cookieStore);
  const id = params.id;

  const { data, error } = await supabase
    .from("form")
    .select(
      `
        title
      `
    )
    .eq("id", id)
    .single();

  if (!data) {
    return notFound();
  }

  return {
    title: `${data.title} | Grida Forms`,
  };
}

export default async function Layout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const { id } = params;
  const cookieStore = cookies();
  const supabase = createServerComponentClient(cookieStore);

  const { data, error } = await supabase
    .from("form")
    .select()
    .eq("id", id)
    .single();

  if (!data) {
    return notFound();
  }

  const { default_form_page_language } = data;

  i18next.init({
    lng: default_form_page_language,
    debug: !IS_PRODUTION,
    resources: {
      en: {
        translation: {
          next: "Next",
          back: "Previous",
          submit: "Submit",
          pay: "Pay",
        },
      },
      ko: {
        translation: {
          next: "다음",
          back: "이전",
          submit: "제출",
          pay: "결제",
        },
      },
    },
  });

  return (
    <html lang={default_form_page_language}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}