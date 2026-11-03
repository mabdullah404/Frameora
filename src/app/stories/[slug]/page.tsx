import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import storiesData from "@/data/stories.json";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Share2,
  BookOpen,
  ArrowRight,
  Compass,
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

export const instant = false;

export function generateStaticParams() {
  return storiesData.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = storiesData.find((s) => s.slug === slug);

  if (!story) {
    return {
      title: "Story Not Found — Frameora",
      description: "Visual photo essay not found.",
    };
  }

  return {
    title: `${story.title} — Frameora Visual Journal`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [{ url: story.coverImage, width: 1200, height: 630, alt: story.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.excerpt,
      images: [story.coverImage],
    },
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = storiesData.find((s) => s.slug === slug);

  if (!story) {
    return notFound();
  }

  // Find other stories for recommendations
  const otherStories = storiesData.filter((s) => s.slug !== slug);

  return (
    <article className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-8">
        <Link
          href="/#stories"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Visual Stories</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-semibold">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Photo Essay</span>
        </span>
      </div>

      {/* Hero Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-purple-300">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-purple-400" />
            <span>{story.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-gray-400">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>{story.location}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-gray-400">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>{story.readTime}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          {story.title}
        </h1>

        <p className="text-base sm:text-lg font-medium text-purple-200/90 leading-relaxed max-w-3xl">
          {story.subtitle}
        </p>

        {/* Author Credit */}
        <div className="pt-4 flex items-center gap-3">
          <UserAvatar
            src="/images/Abdullah/FB_IMG_1790540440153.jpg"
            name={story.author}
            size="md"
            className="border-2 border-purple-500/40"
          />
          <div>
            <p className="text-xs font-bold text-white">{story.author}</p>
            <p className="text-[11px] text-gray-400">Photographer & Author • Frameora Creator</p>
          </div>
        </div>
      </header>

      {/* Main Cover Image */}
      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {/* Intro Paragraph */}
      <div className="mt-10 border-l-2 border-purple-500 pl-6 py-1">
        <p className="text-sm sm:text-base font-normal italic text-gray-300 leading-relaxed">
          {story.intro}
        </p>
      </div>

      {/* Story Sections */}
      <div className="mt-12 space-y-14">
        {story.sections.map((section, idx) => (
          <section key={idx} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {section.heading}
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {section.content}
            </p>

            {/* Section Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {section.images.map((img, imgIdx) => (
                <figure key={imgIdx} className="space-y-2">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <Image
                      src={img.src}
                      alt={img.caption}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <figcaption className="text-xs text-gray-400 italic px-1">
                    {img.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <div className="mt-14 rounded-3xl border border-white/10 bg-[#121422]/70 p-6 sm:p-8 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-white mb-2">Reflections</h3>
        <p className="text-sm text-gray-300 leading-relaxed italic">
          &ldquo;{story.conclusion}&rdquo;
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-white/[0.08]">
          <span>Captured with natural light across Bangladesh</span>
          <span className="text-purple-400 font-semibold">— Frameora Visual Journal</span>
        </div>
      </div>

      {/* More Visual Stories */}
      {otherStories.length > 0 && (
        <aside className="mt-16 pt-10 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              More Visual Stories
            </h3>
            <Link href="/explore" className="text-xs text-purple-400 hover:underline">
              Explore All Photos →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherStories.map((other) => (
              <Link
                key={other.slug}
                href={`/stories/${other.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121422] p-5 hover:border-purple-500/40 hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-4">
                  <Image
                    src={other.coverImage}
                    alt={other.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
                  {other.readTime} • {other.location}
                </span>
                <h4 className="mt-1 text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {other.title}
                </h4>
                <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                  {other.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
