import { Suspense } from "react";
import type { Metadata } from "next";
import photosData from "@/data/photos.json";
import PhotoDetailClient from "./PhotoDetailClient";

// Disable instant blocking check for dynamic params in Next.js 16
export const instant = false;

export function generateStaticParams() {
  return photosData.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const photo = photosData.find((p) => p.id === id);

  if (!photo) {
    return {
      title: "Photo Not Found — Frameora",
      description: "The requested photograph could not be found.",
    };
  }

  const title = `${photo.title} — Frameora Photography`;
  const description = photo.description || `Explore ${photo.title} by ${photo.photographer || "Md. Abdullah Al Mamun"} on Frameora.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: photo.image,
          width: 1200,
          height: 630,
          alt: photo.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [photo.image],
    },
  };
}

async function PhotoContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string }>;
}) {
  const { id } = await paramsPromise;
  return <PhotoDetailClient id={id} />;
}

export default function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl p-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-400">Loading frame details...</p>
        </div>
      }
    >
      <PhotoContent paramsPromise={params} />
    </Suspense>
  );
}
