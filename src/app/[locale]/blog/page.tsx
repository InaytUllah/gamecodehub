import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: "Gaming Guides & Tips",
    description: "Expert guides, tips, and strategies for Genshin Impact, Free Fire, Roblox, PUBG Mobile and more.",
    locale,
    path: "/blog",
  });
}

interface PostWithTranslation {
  id: string;
  slug: string;
  author: string;
  published_at: string;
  game_id: string | null;
  games?: { name: string; slug: string } | null;
  post_translations: { title: string; excerpt: string | null }[];
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  let posts: PostWithTranslation[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*, games(name, slug), post_translations!inner(title, excerpt)")
      .eq("is_published", true)
      .eq("post_translations.locale", locale)
      .order("published_at", { ascending: false });

    if (data) posts = data as unknown as PostWithTranslation[];
  } catch {
    // Fallback
  }

  return (
    <>
      <Breadcrumbs locale={locale} items={[{ label: t("common.home"), href: "/" }, { label: t("common.blog") }]} />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Gaming Guides & Tips
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Expert guides, tips, and strategies for your favorite games.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => {
            const translation = post.post_translations[0];
            return (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card hover>
                  {post.games && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {post.games.name}
                    </span>
                  )}
                  <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                    {translation.title}
                  </h2>
                  {translation.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {translation.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>{post.author}</span>
                    <span>{formatDate(post.published_at, locale)}</span>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400">
              No guides published yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
