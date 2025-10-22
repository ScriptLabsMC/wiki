/**
 * Formats markdown content while preserving code blocks and structure
 */
export function formatMarkdown(content) {
  if (!content) return "";

  // Split content into code blocks and regular text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts
    .map(part => {
      // If this is a code block, preserve it exactly
      if (part.startsWith('```')) {
        return part;
      }
      
      // Otherwise format the regular text
      return part
        .split('\n')
        .map(line => {
          // Preserve headers
          if (line.startsWith('#')) {
            return '\n' + line + '\n';
          }
          // Preserve lists
          if (line.match(/^[\s]*[-*+]\s/)) {
            return line;
          }
          // Handle inline code
          if (line.match(/^`.*`$/)) {
            return line;
          }
          // Handle normal text
          return line.trim();
        })
        .filter(line => line)
        .join('\n')
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove extra newlines
        .trim();
    })
    .join('\n\n')
    .trim();
}