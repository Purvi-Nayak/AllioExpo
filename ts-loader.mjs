// Simple TypeScript loader workaround for Node.js v20+
export async function resolve(specifier, context, defaultResolve) {
  if (specifier.endsWith('.ts') && !specifier.includes('node_modules')) {
    return defaultResolve(specifier, { ...context, format: 'typescript' });
  }
  return defaultResolve(specifier, context);
}

export async function load(url, context, defaultLoad) {
  if (url.endsWith('.ts') && url.includes('node_modules')) {
    // For TypeScript files in node_modules, treat them as JavaScript
    const result = await defaultLoad(url, { ...context, format: 'module' });
    return result;
  }
  return defaultLoad(url, context);
}
