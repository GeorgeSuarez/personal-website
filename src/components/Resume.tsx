interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

interface Education {
  school: string;
  degree: string;
  period: string;
}

interface Project {
  name: string;
  bullets: string[];
}

const education: Education[] = [
  {
    school: "California State University San Bernardino",
    degree: "Bachelor of Science (B.S.), Computer Science",
    period: "December 2019",
  },
];

const experience: Experience[] = [
  {
    company: "Amazon.com",
    role: "Fulfillment Associate",
    period: "May 2022 — December 2025",
    bullets: [
      "Communicated effectively with supervisors and team leads to address any issues or concerns, ensuring smooth workflow and customer satisfaction.",
      "Resolved and troubleshooted inventory discrepancies, contributing to a 20% reduction in inventory shrinkage.",
      "Collaborated with team members to achieve daily production goals and ensure timely delivery of orders.",
    ],
  },
  {
    company: "Optimal State",
    role: "iOS Developer",
    period: "November 2019 — January 2022",
    bullets: [
      "Designed and developed an iOS application using Swift that allowed users to monitor their habitual mental and emotional states.",
      "Composed clean, maintainable, and scalable code, following best practices and design patterns such as MVC or MVVM.",
      "Provided technical support and assistance to resolve issues reported by users or stakeholders, and implemented enhancements based on feedback to improve app usability and performance.",
    ],
  },
];

const projects: Project[] = [
  {
    name: "LFGuild",
    bullets: [
      "Built an iOS app utilizing SwiftUI and XCode which matches World of Warcraft gamers with guilds based on their preferences and recruitment criteria.",
      "Developed real-time chat functionality with unread message tracking and conversation management.",
    ],
  },
];

export default function Resume() {
  return (
    <div className="text-center">
      {/* Header */}
      <div className="w-16 h-[1px] bg-[#fcee0a] mb-8 mx-auto opacity-60" />

      <h1
        className="text-[#fcee0a] text-4xl sm:text-5xl font-black tracking-[0.15em] uppercase mb-4"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
        }}
      >
        Resume
      </h1>

      <p
        className="text-[#00f0ff]/60 text-lg tracking-[0.2em] uppercase mb-12"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        Personnel file // George Suarez
      </p>

      {/* Terminal Content */}
      <div className="p-6 sm:p-8 text-left">
        {/* Education */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#fcee0a]" />
            <h2
              className="text-[#fcee0a] text-xl tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Education
            </h2>
          </div>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between pl-4 border-l border-[#00f0ff]/20"
              >
                <div>
                  <h3
                    className="text-[#00f0ff] text-lg font-bold"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {edu.school}, San Bernardino, California
                  </h3>
                  <p
                    className="text-gray-300 text-base italic mt-0.5"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {edu.degree}, {edu.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#fcee0a]" />
            <h2
              className="text-[#fcee0a] text-xl tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Work Experience
            </h2>
          </div>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-4 border-l border-[#00f0ff]/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <h3
                    className="text-[#00f0ff] text-lg font-bold"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {exp.company}
                  </h3>
                </div>
                <p
                  className="text-gray-400 text-base italic tracking-wide mb-2"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {exp.role}, {exp.period}
                </p>
                <ul className="space-y-1">
                  {exp.bullets.map((bullet, bIndex) => (
                    <li
                      key={bIndex}
                      className="text-gray-300 text-base leading-relaxed flex items-start gap-2"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      <span className="text-[#00f0ff]/40 mt-0.5">&gt;</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#fcee0a]" />
            <h2
              className="text-[#fcee0a] text-xl tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Projects
            </h2>
          </div>
          <div className="space-y-6">
            {projects.map((proj, index) => (
              <div
                key={index}
                className="relative pl-4 border-l border-[#00f0ff]/20"
              >
                <h3
                  className="text-[#00f0ff] text-xl font-bold mb-2"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {proj.name}
                </h3>
                <ul className="space-y-1">
                  {proj.bullets.map((bullet, bIndex) => (
                    <li
                      key={bIndex}
                      className="text-gray-300 text-base leading-relaxed flex items-start gap-2"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      <span className="text-[#00f0ff]/40 mt-0.5">&gt;</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#fcee0a]" />
            <h2
              className="text-[#fcee0a] text-xl tracking-[0.2em] uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Skills
            </h2>
          </div>
          <div className="pl-4 border-l border-[#00f0ff]/20 space-y-3">
            <p
              className="text-gray-300 text-base leading-relaxed"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              <span className="text-[#00f0ff] text-lg">Technical Skills:</span>{" "}
              C++, C#, Swift, Java {""}
              JavaScript, TypeScript, React.js, Node.js, Python, HTML/CSS
            </p>
            <p
              className="text-gray-300 text-base leading-relaxed"
              style={{ fontFamily: "'Share Tech Mono', monospace" }}
            >
              <span className="text-[#00f0ff] text-lg">Certificates:</span>{" "}
              Full-stack Development Certificate from Fullstack Academy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
