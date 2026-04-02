import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateArticleSchema } from "@/lib/seo/structured-data";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/date";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  try {
    const supabase = await createClient();
    const { data: post } = await supabase
      .from("posts")
      .select("*, post_translations!inner(title, meta_title, meta_description)")
      .eq("slug", slug)
      .eq("is_published", true)
      .eq("post_translations.locale", locale)
      .single();

    if (!post) return {};
    const translation = post.post_translations[0];

    return generatePageMetadata({
      title: translation.meta_title || translation.title,
      description: translation.meta_description || "",
      locale,
      path: `/blog/${slug}`,
    });
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  interface BlogPost {
    slug: string;
    author: string;
    published_at: string;
    updated_at: string;
    games?: { name: string; slug: string } | null;
    post_translations: { title: string; content: string; excerpt: string | null }[];
  }

  let post: BlogPost | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, games(name, slug), post_translations!inner(title, content, excerpt)")
      .eq("slug", slug)
      .eq("is_published", true)
      .eq("post_translations.locale", locale)
      .single();

    if (data) post = data as unknown as BlogPost;
  } catch {
    // Fallback
  }

  if (!post) notFound();

  const postData = post as BlogPost;
  const translation = postData.post_translations[0];

  return (
    <>
      <JsonLd
        data={generateArticleSchema({
          title: translation.title,
          description: translation.excerpt || "",
          url: `${SITE_URL}/${locale}/blog/${slug}`,
          publishedAt: postData.published_at,
          updatedAt: postData.updated_at,
          author: postData.author,
        })}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { label: t("common.home"), href: "/" },
          { label: t("common.blog"), href: "/blog" },
          { label: translation.title },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        {postData.games && (
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {postData.games.name}
          </span>
        )}
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {translation.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>By {postData.author}</span>
          <span>{formatDate(postData.published_at, locale)}</span>
        </div>

        <div
          className="prose prose-gray mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: translation.content.replace(/\n/g, "<br>") }}
        />
      </article>
    </>
  );
}
