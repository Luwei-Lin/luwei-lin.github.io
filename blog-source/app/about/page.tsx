export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Me</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Hi! I&apos;m Luwei (Luis) Lin, a software engineer passionate about building
            elegant solutions to complex problems.
          </p>

          <h2>Background</h2>
          <p>
            I specialize in web development, with expertise in modern JavaScript
            frameworks, TypeScript, and full-stack development. I love creating
            user-friendly applications and sharing my knowledge with the developer
            community.
          </p>

          <h2>What I Do</h2>
          <ul>
            <li>Build scalable web applications</li>
            <li>Write technical articles and tutorials</li>
            <li>Contribute to open-source projects</li>
            <li>Mentor aspiring developers</li>
          </ul>

          <h2>Skills & Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Frontend</h3>
              <ul className="text-sm space-y-1">
                <li>React / Next.js</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Backend</h3>
              <ul className="text-sm space-y-1">
                <li>Node.js</li>
                <li>Python</li>
                <li>PostgreSQL</li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">Tools</h3>
              <ul className="text-sm space-y-1">
                <li>Git / GitHub</li>
                <li>Docker</li>
                <li>VS Code</li>
              </ul>
            </div>
          </div>

          <h2>Get in Touch</h2>
          <p>
            I&apos;m always interested in connecting with fellow developers and working
            on interesting projects. Feel free to reach out!
          </p>

          <div className="flex gap-4 mt-6">
            <a
              href="https://github.com/Luwei-Lin"
              className="text-blue-600 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              className="text-blue-600 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
