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
  { name: "Tailwind CSS", category: "Frameworks", icon: "tailwindcss" },
  { name: "Vite", category: "Frameworks", icon: "vitejs" },
  { name: "Git", category: "Tools", icon: "git" },
  { name: "Linux", category: "Tools", icon: "linux" },
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
  { color: string; borderColor: string }
> = {
  Languages: { color: "#fcee0a", borderColor: "border-yellow/30" },
  Frameworks: { color: "#00f0ff", borderColor: "border-cyan/30" },
  Tools: { color: "#ff0055", borderColor: "border-magenta/30" },
  Databases: { color: "#00f0ff", borderColor: "border-cyan/30" },
};

const categoryText: Record<Skill["category"], string> = {
  Languages: "text-yellow",
  Frameworks: "text-cyan",
  Tools: "text-magenta",
  Databases: "text-cyan",
};

const categoryHoverBorder: Record<Skill["category"], string> = {
  Languages: "hover:border-yellow",
  Frameworks: "hover:border-cyan",
  Tools: "hover:border-magenta",
  Databases: "hover:border-cyan",
};

const categoryHoverText: Record<Skill["category"], string> = {
  Languages: "group-hover:text-yellow",
  Frameworks: "group-hover:text-cyan",
  Tools: "group-hover:text-magenta",
  Databases: "group-hover:text-cyan",
};

const categoryHoverShadow: Record<Skill["category"], string> = {
  Languages: "hover:shadow-[0_0_15px_rgba(252,238,10,0.2)]",
  Frameworks: "hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",
  Tools: "hover:shadow-[0_0_15px_rgba(255,0,85,0.2)]",
  Databases: "hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]",
};

const categoryHoverCorner: Record<Skill["category"], string> = {
  Languages: "group-hover:border-yellow",
  Frameworks: "group-hover:border-cyan",
  Tools: "group-hover:border-magenta",
  Databases: "group-hover:border-cyan",
};

function SkillCard({ skill }: { skill: Skill }) {
  const config = categoryConfig[skill.category];
  const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`;

  return (
    <div
      className={`group relative border ${config.borderColor} ${categoryHoverBorder[skill.category]} bg-background/50 backdrop-blur-sm p-4 flex flex-col items-center gap-3 transition-all duration-300 ${categoryHoverShadow[skill.category]} hover:scale-[1.02] cursor-default`}
    >
      <div
        className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${config.borderColor} ${categoryHoverCorner[skill.category]}`}
      />
      <div
        className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-colors ${config.borderColor} ${categoryHoverCorner[skill.category]}`}
      />
      <div
        className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-colors ${config.borderColor} ${categoryHoverCorner[skill.category]}`}
      />
      <div
        className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${config.borderColor} ${categoryHoverCorner[skill.category]}`}
      />

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

      <span
        className={`text-muted text-sm font-bold tracking-[0.1em] uppercase ${categoryHoverText[skill.category]} transition-colors duration-300 font-mono`}
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
        className={`text-xl font-bold tracking-[0.3em] uppercase ${categoryText[category]} font-display`}
        style={{
          textShadow: `0 0 10px ${config.color}40`,
        }}
      >
        {category}
      </h2>
      <span className={`text-[12px] tracking-[0.2em] uppercase opacity-40 font-mono ${categoryText[category]}`}>
        {count} entries
      </span>
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: `${config.color}30` }}
      />
    </div>
  );
}

export default function Skills() {
  return (
    <div className="text-center">
      <div className="w-16 h-px bg-yellow mb-8 mx-auto opacity-60" />

      <h1 className="text-yellow text-4xl sm:text-5xl font-black tracking-[0.15em] uppercase mb-4 font-display"
        style={{
          textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
        }}
      >
        Skills
      </h1>

      <p className="text-cyan/60 text-lg tracking-[0.2em] uppercase mb-16 font-mono">
        Neural skill grid // {skills.length} protocols loaded
      </p>

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
