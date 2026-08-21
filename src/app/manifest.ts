import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AgentShield",
    short_name: "AgentShield",
    description: "AI agent and non-human identity security control plane.",
    start_url: "/",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#5eead4",
  };
}
