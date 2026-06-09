interface Skill {
  name: string;
  category: "Languages" | "Frameworks" | "Tools" | "Databases";
  icon: string;
}

const skills: Skill[] = [
  { name: "TypeScript", category: "Languages", icon: "typescript" },
  { name: "JavaScript", category: "Languages", icon: "javascript" },
  { name: "Python", category: "Languages", icon: "python" },
  { name: "C / C++", category: "Languages", icon: "cplusplus" },
  { name: "Swift", category: "Languages", icon: "swift" },
  { name: "Java", category: "Languages", icon: "java" },
  { name: "C#", category: "Languages", icon: "csharp" },
  { name: "React", category: "Frameworks", icon: "react" },
  { name: "Node.js", category: "Frameworks", icon: "nodejs" },
  { name: "Express", category: "Frameworks", icon: "express" },
  { name: "Tailwind CSS", category: "Frameworks", icon: "tailwindcss" },
  { name: "Vite", category: "Frameworks", icon: "vitejs" },
  { name: "Git", category: "Tools", icon: "git" },
  { name: "Docker", category: "Tools", icon: "docker" },
  { name: "Linux", category: "Tools", icon: "linux" },
  { name: "PostgreSQL", category: "Databases", icon: "postgresql" },
  { name: "SQLite", category: "Databases", icon: "sqlite" },
];

const categories: Skill["category"][] = [
  "Languages",
  "Frameworks",
  "Tools",
  "Databases",
];

const categoryConfig: Record<
  Skill["category"],
  {
    color: string;
    borderColor: string;
    hoverBorder: string;
    hoverText: string;
    hoverShadow: string;
    cornerColor: string;
    hoverCorner: string;
  }
> = {
  Languages: {
    color: "#fcee0a",
    borderColor: "border-[#fcee0a]/30",
    hoverBorder: "hover:border-[#fcee0a]",
    hoverText: "group-hover:text-[#fcee0a]",
    hoverShadow: "hover:shadow-[0_0_15px_rgba(252,238,10,0.2)]",
    cornerColor: "border-[#fcee0a]/30",
    hoverCorner: "group-hover:border-[#fcee0a]",
  },
  Frameworks: {
    color: "#00f0ff",
    borderColor: "border-[#00f0ff]/30",
    hoverBorder: "hover:border-[#00f0ff]",
    hoverText: "group-hover:text-[#00f0ff]",
    hoverShadow: "hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",
    cornerColor: "border-[#00f0ff]/30",
    hoverCorner: "group-hover:border-[#00f0ff]",
  },
  Tools: {
    color: "#ff0055",
    borderColor: "border-[#ff0055]/30",
    hoverBorder: "hover:border-[#ff0055]",
    hoverText: "group-hover:text-[#ff0055]",
    hoverShadow: "hover:shadow-[0_0_15px_rgba(255,0,85,0.2)]",
    cornerColor: "border-[#ff0055]/30",
    hoverCorner: "group-hover:border-[#ff0055]",
  },
  Databases: {
    color: "#00f0ff",
    borderColor: "border-[#00f0ff]/30",
    hoverBorder: "hover:border-[#00f0ff]",
    hoverText: "group-hover:text-[#00f0ff]",
    hoverShadow: "hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",
    cornerColor: "border-[#00f0ff]/30",
    hoverCorner: "group-hover:border-[#00f0ff]",
  },
};

function SkillCard({ skill }: { skill: Skill }) {
  const config = categoryConfig[skill.category];
  const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`;

  return (
    <div
      className={`group relative border ${config.borderColor} ${config.hoverBorder} bg-[#0a0a0f]/50 backdrop-blur-sm p-4 flex flex-col items-center gap-3 transition-all duration-300 ${config.hoverShadow} hover:scale-[1.02] cursor-default`}
    >
      {/* Corner accents */}
      <div
        className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${config.cornerColor} ${config.hoverCorner}`}
      />
      <div
        className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${config.cornerColor} ${config.hoverCorner}`}
      />
      <div
        className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${config.cornerColor} ${config.hoverCorner}`}
      />
      <div
        className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${config.cornerColor} ${config.hoverCorner}`}
      />

      {/* Icon */}
      <img
        src={iconUrl}
        alt={skill.name}
        className="w-10 h-10 object-contain transition-all duration-300 group-hover:brightness-110 group-hover:scale-110"
        style={{
          filter: `drop-shadow(0 0 2px ${config.color}40)`,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Name */}
      <span
        className={`text-gray-300 text-sm font-bold tracking-[0.1em] uppercase ${config.hoverText} transition-colors duration-300`}
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        {skill.name}
      </span>
    </div>
  );
}

function CategoryHeader({ category }: { category: Skill["category"] }) {
  const config = categoryConfig[category];
  const count = skills.filter((s) => s.category === category).length;

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-2 h-2" style={{ backgroundColor: config.color }} />
      <h2
        className="text-xl font-bold tracking-[0.3em] uppercase"
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: config.color,
          textShadow: `0 0 10px ${config.color}40`,
        }}
      >
        {category}
      </h2>
      <span
        className="text-[10px] tracking-[0.2em] uppercase opacity-40"
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: config.color,
        }}
      >
        {count} entries
      </span>
      <div
        className="flex-1 h-[1px]"
        style={{ backgroundColor: `${config.color}30` }}
      />
    </div>
  );
}

export default function Skills() {
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
        Skills
      </h1>

      <p
        className="text-[#00f0ff]/60 text-xs tracking-[0.4em] uppercase mb-16"
        style={{ fontFamily: "'Share Tech Mono', monospace" }}
      >
        Neural skill grid // {skills.length} protocols loaded
      </p>

      {/* Categories */}
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category}>
            <CategoryHeader category={category} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills
                .filter((s) => s.category === category)
                .map((skill, index) => (
                  <SkillCard key={index} skill={skill} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
