import ResumePreviewButton from '@/components/ResumePreviewButton';

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
        <ResumePreviewButton />

        {/* Bio */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p>
            Full-stack software engineer with 2+ years of production experience building and 
            shipping user-facing systems at scale. Currently at Avanti HCM, where I’ve owned 
            features end-to-end, including leading the 0→1 development of a payroll module, 
            designing backend systems, APIs, and data models for complex, correctness-critical workflows.
          </p>
          <p>
            I work across the stack with TypeScript/React on the frontend and C#/.NET on the backend, 
            backed by PostgreSQL. I focus on building reliable APIs and debugging distributed systems 
            issues across services.
          </p>
          <p>
            I also bring strong systems and networking fundamentals from my experience at Arista Networks,
            where I worked on routing infrastructure in C++. This allows me to reason about performance 
            and scalability beyond typical web development. I also hold Cisco expert-level certifications.
            That depth makes me a better systems thinker when debugging distributed issues or designing APIs.
          </p>
          <p>
            I use Claude Code as part of my regular workflow: drafting pull request descriptions,
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
