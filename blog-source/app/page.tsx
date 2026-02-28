import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Hey! I&apos;m Luwei (Luis) Lin
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Software Engineer | Technical Writer | Problem Solver
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Read My Blog
            </Link>
            <Link
              href="/about"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold px-6 py-3 rounded-lg transition"
            >
              About Me
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">💻 Technical Writing</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Sharing knowledge about software development, best practices, and lessons learned.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">🚀 Projects</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Building solutions and experimenting with new technologies.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">📚 Learning</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Constantly exploring and documenting my journey in tech.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
