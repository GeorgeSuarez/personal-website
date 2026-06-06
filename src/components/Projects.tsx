import { Link } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Neural Net Crawler",
    description:
      "Real-time data extraction agent that scrapes the Net for market intel and synthesizes reports for corpo clients.",
    tags: ["Rust", "WebSocket", "Tokio"],
    status: "Active",
  },
  {
    id: "02",
    title: "Kiroshi Optics HUD",
    description:
      "Augmented reality overlay for smart-glass displays. Renders threat detection, nav markers, and comms in real-time.",
    tags: ["TypeScript", "WebGL", "React"],
    status: "Active",
  },
  {
    id: "03",
    title: "Black ICE Firewall",
    description:
      "Intrusion detection daemon with heuristic pattern analysis. Deployed on private subnets across the Pacifica district.",
    tags: ["Go", "BPF", "eBPF"],
    status: "Beta",
  },
  {
    id: "04",
    title: "SynthWave FM",
    description:
      "Decentralized audio streaming node powered by WebRTC. Peer-to-peer signal routing with zero central servers.",
    tags: ["Node.js", "WebRTC", "IPFS"],
    status: "Active",
  },
  {
    id: "05",
    title: "Ripperdoc OS",
    description:
      "Inventory and scheduling platform for underground cyberware clinics. Tracks implants, appointments, and supply chains.",
    tags: ["Python", "FastAPI", "PostgreSQL"],
    status: "Alpha",
  },
  {
    id: "06",
    title: "Night City Transit Grid",
    description:
      "Live metro and AV routing dashboard. Predictive delay modeling using crowd-sourced telemetry from 15,000 vehicles.",
    tags: ["Scala", "Kafka", "Spark"],
    status: "Beta",
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center px-6 py-20 text-center relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="w-16 h-[1px] bg-[#fcee0a] mb-8 mx-auto opacity-60" />

        <h1
          className="text-[#fcee0a] text-4xl sm:text-5xl font-black tracking-[0.15em] uppercase mb-4"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 20px rgba(252, 238, 10, 0.3)",
          }}
        >
          Projects
        </h1>

        <p
          className="text-[#00f0ff]/60 text-lg tracking-[0.4em] uppercase mb-16"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          Archived builds // {projects.length} entries found
        </p>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative border border-[#00f0ff]/10 bg-[#0a0a0f] p-6 hover:border-[#00f0ff]/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.08)] transition-all duration-300"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#fcee0a]/30 group-hover:border-[#fcee0a] transition-colors" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#fcee0a]/30 group-hover:border-[#fcee0a] transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#fcee0a]/30 group-hover:border-[#fcee0a] transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#fcee0a]/30 group-hover:border-[#fcee0a] transition-colors" />

              {/* Header row */}
              <div className="flex items-start justify-between mb-4">
                <span
                  className="text-[#00f0ff]/40 text-[10px] tracking-[0.3em]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  ID:{project.id}
                </span>
                <span
                  className={`text-[14px] tracking-[0.2em] uppercase px-2 py-0.5 border ${
                    project.status === "Active"
                      ? "text-[#fcee0a] border-[#fcee0a]/30 bg-[#fcee0a]/5"
                      : project.status === "Beta"
                        ? "text-[#00f0ff] border-[#00f0ff]/30 bg-[#00f0ff]/5"
                        : "text-gray-400 border-gray-700 bg-gray-900/50"
                  }`}
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {project.status}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-gray-200 text-lg sm:text-xl tracking-[0.1em] uppercase mb-3 group-hover:text-[#fcee0a] transition-colors duration-300"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {project.title}
              </h2>

              {/* Description */}
              <p
                className="text-gray-400 text-sm leading-relaxed mb-5"
                style={{ fontFamily: "'Share Tech Mono', monospace" }}
              >
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[14px] text-[#00f0ff]/60 tracking-[0.15em] uppercase border border-[#00f0ff]/15 px-2 py-1 font-bold"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
