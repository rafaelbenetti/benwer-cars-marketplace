import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug,
    description: `Browse available cars from ${slug}.`,
  };
}

async function CompanyPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {slug}
      </h1>
    </main>
  );
}

export default CompanyPage;
