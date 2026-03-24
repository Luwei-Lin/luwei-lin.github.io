// Feature flags — set to true/false to enable or disable site features.
// Changes here take effect on the next build/deploy.

const features = {
  tools: true, // Resume Builder and other tools
} as const;

export default features;
