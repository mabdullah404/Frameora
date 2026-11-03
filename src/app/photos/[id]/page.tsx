import { Suspense } from "react";
import photosData from "@/data/photos.json";
import PhotoDetailClient from "./PhotoDetailClient";

// Disable instant blocking check for dynamic params in Next.js 16
export const instant = false;

export function generateStaticParams() {
  return photosData.map((p) => ({
    id: p.id,
  }));
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
