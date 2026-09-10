import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, id } = await params;
  return {
    title: `Car ${id} — ${slug}`,
  };
}

async function CompanyCarDetailPage({ params }: Props) {
  const { slug, id } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Car detail
      </h1>
      <p className="text-muted-foreground text-sm mt-2">
        {slug} / {id}
      </p>
    </main>
  );
}

export default CompanyCarDetailPage;
