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

function SkillCard({ skill }: { skill: Skill }) {
  const config = categoryConfig[skill.category];
  const iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-original.svg`;

  return (
    <div
      className={`skill-card group border ${config.borderColor} ${categoryHoverBorder[skill.category]} bg-background/50 p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-[1.02] cursor-default rounded`}
    >
      <img
        src={iconUrl}
        alt={skill.name}
        className="w-9 h-9 object-contain transition-all duration-200 group-hover:scale-110"
        style={{
          filter: `drop-shadow(0 0 2px ${config.color}40)`,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      <span
        className={`text-xs font-semibold tracking-wide uppercase ${categoryHoverText[skill.category]} transition-colors duration-200 text-muted`}
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
    <div className="flex items-center gap-3 mb-4">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
      <h2
        className={`text-sm font-bold tracking-wider uppercase ${categoryText[category]}`}
      >
        {category}
      </h2>
      <span className="text-[11px] tracking-wider uppercase opacity-40 text-muted">
        {count}
      </span>
      <div
        className="flex-1 h-px"
        style={{ backgroundColor: `${config.color}20` }}
      />
    </div>
  );
}

export default function Skills() {
  return (
    <div>
      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category}>
            <CategoryHeader category={category} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {skills
                .filter((s) => s.category === category)
                .map((skill, index) => (
                  <div
                    key={index}
                    className="animate-card-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <SkillCard skill={skill} />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
