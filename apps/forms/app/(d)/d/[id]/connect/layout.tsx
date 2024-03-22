import Link from "next/link";

export default function Layout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const id = params.id;

  return (
    <main className="flex gap-4 h-screen">
      {/* side */}
      <nav className="col-span-1 max-w-xs min-w-60 w-min border-r h-full">
        <ul className="flex flex-col">
          <li>
            <Link href={`/d/${id}/connect/customer`}>
              <button className="w-full text-left px-4 py-4 bg-transparent hover:bg-neutral-500/10">
                Customer Identity
              </button>
            </Link>
          </li>
          <li>
            <Link href={`/d/${id}/connect/datasource/db`}>
              <button className="w-full text-left px-4 py-4 bg-transparent hover:bg-neutral-500/10">
                Data Source
              </button>
            </Link>
          </li>
          <li>
            <Link href={`/d/${id}/connect/webhooks`}>
              <button className="w-full text-left px-4 py-4 bg-transparent hover:bg-neutral-500/10">
                Webhooks
              </button>
            </Link>
          </li>
          <li>
            <Link href={`/d/${id}/connect/integrations`}>
              <button className="w-full text-left px-4 py-4 bg-transparent hover:bg-neutral-500/10">
                Integrations
              </button>
            </Link>
          </li>
          <li>
            <Link href={`/d/${id}/connect/import`}>
              <button className="w-full text-left px-4 py-4 bg-transparent hover:bg-neutral-500/10">
                Import
              </button>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="w-full h-full overflow-scroll pt-4">{children}</div>
    </main>
  );
}