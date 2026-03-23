export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <h1 className="text-4xl font-bold mb-2">Luwei (Luis) Lin</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
          Software Developer · Avanti HCM
        </p>

        {/* Download Button */}
        <a
          href="/luwei-lin-resume-2024.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg mb-10 transition-colors"
        >
          View Resume (PDF)
        </a>

        {/* Bio */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>
            Fullstack software developer with 2+ years of production experience at Avanti HCM,
            building enterprise HR software used by real organizations. Started as a co-op and
            converted to full-time — proof of consistent delivery, not just internship checkboxes.
          </p>
          <p>
            I work across the stack daily — TypeScript and React on the frontend, C# and .Net on
            the backend, PostgreSQL for data. I also hold Cisco expert-level certifications and
            interned at Arista Networks working on routing infrastructure in C++ — which means I
            understand the network layer that most web developers treat as a black box. That depth
            makes me a better systems thinker when debugging distributed issues or designing APIs.
          </p>
          <p>
            I use Claude Code as part of my regular workflow — drafting pull request descriptions,
            clarifying tasks, generating test cases, and running agentic coding workflows. I treat
            AI as a force multiplier, not a crutch.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Card 1: Current Role */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-3">Current Role</h2>
            <p className="font-semibold text-sm mb-1">Avanti HCM Software</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Software Developer (SDE I)<br />
              April 2024 – Present · Calgary, AB<br />
              Co-op → Full-time
            </p>
            <div className="flex flex-wrap gap-1">
              {['TypeScript', 'React', 'Redux', 'C#', '.Net', 'PostgreSQL'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: AI-Augmented Workflow */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-3">AI-Augmented Workflow</h2>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 mb-3">
              <li>Writing PR summaries &amp; descriptions</li>
              <li>Task clarification &amp; ticket breakdown</li>
              <li>Generating &amp; reviewing test cases</li>
              <li>Agentic coding workflows &amp; skills</li>
            </ul>
            <div className="flex flex-wrap gap-1">
              {['Claude Code', 'TypeScript', 'React', 'C#', 'Git', 'Docker'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Background */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-3">Background</h2>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-medium">University of Alberta</span><br />
                B.Sc. Computing Science &amp; Statistics<br />
                Dean&apos;s Honor Roll
              </li>
              <li>
                <span className="font-medium">Cisco Certified:</span> CCIE · CCNP · CCNA
              </li>
              <li>
                <span className="font-medium">Google</span> Data Analytics Professional
              </li>
              <li className="text-gray-500 dark:text-gray-400 text-xs">
                Also: Arista Networks · U of A Research · ShopHopper · Mitacs
              </li>
            </ul>
          </div>

        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          <a
            href="https://github.com/Luwei-Lin"
            className="text-blue-600 hover:text-blue-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/luwei-lin"
            className="text-blue-600 hover:text-blue-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="mailto:luwei2@ualberta.ca"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            luwei2@ualberta.ca
          </a>
        </div>

      </div>
    </div>
  );
}
