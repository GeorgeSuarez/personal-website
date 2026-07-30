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
  {
    name: "Rusty Vault",
    bullets: [
      "Developed a terminal user interface(TUI) in Rust which manages passwords and API credentials.",
      "Implemented an encryption algorithm with AES-256-GCM that encrypts passwords and API credentials before writing to a local SQLite database.",
    ],
  },
];

export default function Resume() {
  return (
    <div className="text-center">
      <div className="w-16 h-px bg-yellow mb-8 mx-auto opacity-60" />

      <h1 className="text-yellow text-4xl sm:text-5xl font-black tracking-[0.15em] uppercase mb-4 font-display"
        style={{
          textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
        }}
      >
        Resume
      </h1>

      <p className="text-cyan/60 text-lg tracking-[0.2em] uppercase mb-12 font-mono">
        Personnel file // George Suarez
      </p>

      <div className="p-6 sm:p-8 text-left">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow" />
            <h2 className="text-yellow text-xl tracking-[0.2em] uppercase font-display">
              Education
            </h2>
          </div>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between pl-4 border-l border-cyan/20"
              >
                <div>
                  <h3 className="text-cyan text-lg font-bold font-mono">
                    {edu.school}, San Bernardino, California
                  </h3>
                  <p className="text-muted text-base italic mt-0.5 font-mono">
                    {edu.degree}, {edu.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow" />
            <h2 className="text-yellow text-xl tracking-[0.2em] uppercase font-display">
              Work Experience
            </h2>
          </div>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-4 border-l border-cyan/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                  <h3 className="text-cyan text-lg font-bold font-mono">
                    {exp.company}
                  </h3>
                </div>
                <p className="text-muted text-base italic tracking-wide mb-2 font-mono">
                  {exp.role}, {exp.period}
                </p>
                <ul className="space-y-1">
                  {exp.bullets.map((bullet, bIndex) => (
                    <li
                      key={bIndex}
                      className="text-muted text-base leading-relaxed flex items-start gap-2 font-mono"
                    >
                      <span className="text-cyan/40 mt-0.5">&gt;</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow" />
            <h2 className="text-yellow text-xl tracking-[0.2em] uppercase font-display">
              Projects
            </h2>
          </div>
          <div className="space-y-6">
            {projects.map((proj, index) => (
              <div
                key={index}
                className="relative pl-4 border-l border-cyan/20"
              >
                <h3 className="text-cyan text-xl font-bold mb-2 font-mono">
                  {proj.name}
                </h3>
                <ul className="space-y-1">
                  {proj.bullets.map((bullet, bIndex) => (
                    <li
                      key={bIndex}
                      className="text-muted text-base leading-relaxed flex items-start gap-2 font-mono"
                    >
                      <span className="text-cyan/40 mt-0.5">&gt;</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow" />
            <h2 className="text-yellow text-xl tracking-[0.2em] uppercase font-display">
              Skills
            </h2>
          </div>
          <div className="pl-4 border-l border-cyan/20 space-y-3">
            <p className="text-muted text-base leading-relaxed font-mono">
              <span className="text-cyan text-lg">Technical Skills:</span>{" "}
              C++, C#, Swift, Java {" "}
              JavaScript, TypeScript, React.js, Node.js, Python, HTML/CSS
            </p>
            <p className="text-muted text-base leading-relaxed font-mono">
              <span className="text-cyan text-lg">Certificates:</span>{" "}
              Full-stack Development Certificate from Fullstack Academy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
