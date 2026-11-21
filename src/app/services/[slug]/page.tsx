import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceLanding } from "@/components/sections/ServiceLanding";
import { blocks } from "@/content/approved";
import { SERVICES, getServiceBySlug, servicePath } from "@/content/services";
import { canonicalUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  const path = servicePath(service.slug);
  const approvedTitle = blocks(service.approvedSection)[0].text;
  return {
    title: { absolute: approvedTitle },
    description: service.metaDescription,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: {
      title: approvedTitle,
      description: service.metaDescription,
      url: canonicalUrl(path),
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceLanding service={service} />;
}
