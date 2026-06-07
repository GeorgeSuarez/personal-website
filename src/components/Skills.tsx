import { Link } from "react-router-dom";

interface SkillNode {
  name: string;
  level: number;
  children?: SkillNode[];
}

const skillTree: SkillNode[] = [
  {
    name: "Languages",
    level: 0,
    children: [
      { name: "TypeScript", level: 1 },
      { name: "JavaScript", level: 1 },
      { name: "Python", level: 1 },
      { name: "Rust", level: 1 },
      { name: "Go", level: 1 },
      { name: "C / C++", level: 1 },
    ],
  },
  {
    name: "Frameworks",
    level: 0,
    children: [
      { name: "React", level: 1 },
      { name: "Node.js", level: 1 },
      { name: "Express", level: 1 },
      { name: "Django", level: 1 },
      { name: "Tailwind CSS", level: 1 },
      { name: "Vite", level: 1 },
    ],
  },
  {
    name: "Tools",
    level: 0,
    children: [
      { name: "Git", level: 1 },
      { name: "Docker", level: 1 },
      { name: "AWS", level: 1 },
      { name: "Linux", level: 1 },
      { name: "Kubernetes", level: 1 },
      { name: "CI/CD", level: 1 },
    ],
  },
  {
    name: "Databases",
    level: 0,
    children: [
      { name: "PostgreSQL", level: 1 },
      { name: "MongoDB", level: 1 },
      { name: "Redis", level: 1 },
      { name: "SQLite", level: 1 },
    ],
  },
];

function SkillNodeComponent({ node }: { node: SkillNode }) {
  const isRoot = node.level === 0;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Connecting line from parent */}
      {isRoot && <div className="w-[1px] h-8 bg-[#00f0ff]/30 mb-2" />}

      {/* Node */}
      <div
        className={`relative group border transition-all duration-300 hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] w-full ${
          isRoot
            ? "border-[#fcee0a]/40 bg-[#fcee0a]/5 px-6 py-3"
            : "border-[#00f0ff]/20 bg-[#0a0a0f] px-4 py-2"
        }`}
      >
        {/* Corner accents */}
        <div
          className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${
            isRoot
              ? "border-[#fcee0a]/50 group-hover:border-[#fcee0a]"
              : "border-[#00f0ff]/30 group-hover:border-[#00f0ff]"
          }`}
        />
        <div
          className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${
            isRoot
              ? "border-[#fcee0a]/50 group-hover:border-[#fcee0a]"
              : "border-[#00f0ff]/30 group-hover:border-[#00f0ff]"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${
            isRoot
              ? "border-[#fcee0a]/50 group-hover:border-[#fcee0a]"
              : "border-[#00f0ff]/30 group-hover:border-[#00f0ff]"
          }`}
        />
        <div
          className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${
            isRoot
              ? "border-[#fcee0a]/50 group-hover:border-[#fcee0a]"
              : "border-[#00f0ff]/30 group-hover:border-[#00f0ff]"
          }`}
        />

        <span
          className={`text-lg font-bold tracking-[0.2em] uppercase ${
            isRoot
              ? "text-[#fcee0a]"
              : "text-gray-300 group-hover:text-[#00f0ff]"
          }`}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          {isRoot ? `> ${node.name}` : node.name}
        </span>
      </div>

      {/* Children - vertical stack */}
      {node.children && node.children.length > 0 && (
        <>
          {/* Vertical line down */}
          <div className="w-[1px] h-6 bg-[#00f0ff]/30" />

          <div className="flex flex-col items-center gap-3 w-full">
            {node.children.map((child, childIndex) => (
              <div
                key={childIndex}
                className="flex flex-col items-center w-full"
              >
                {/* Vertical line up to parent */}
                <div className="w-[1px] h-4 bg-[#00f0ff]/30" />
                <SkillNodeComponent node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Skills() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center px-4 sm:px-6 py-16 text-center relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="w-16 h-[1px] bg-[#fcee0a] mb-8 mx-auto opacity-60" />

        <h1
          className="text-[#fcee0a] text-4xl sm:text-5xl font-black tracking-[0.15em] uppercase mb-4"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
          }}
        >
          Skills
        </h1>

        <p
          className="text-[#00f0ff]/60 text-xs tracking-[0.4em] uppercase mb-16"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          Neural skill tree //{" "}
          {skillTree.reduce((acc, cat) => acc + (cat.children?.length || 0), 0)}{" "}
          protocols loaded
        </p>

        {/* Skill Tree */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {skillTree.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <SkillNodeComponent node={category} />
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-16">
          <Link
            to="/"
            className="inline-block text-[#00f0ff] text-lg tracking-[0.4em] uppercase border border-[#00f0ff]/30 px-6 py-3 hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all duration-300"
            style={{ fontFamily: "'Share Tech Mono', monospace" }}
          >
            &lt; Return to Mainframe
          </Link>
        </div>
      </div>
    </div>
  );
}
