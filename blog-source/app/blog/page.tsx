import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Technical articles, tutorials, and insights on software development.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b pb-8">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 transition">
                  {post.title}
                </h2>
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
