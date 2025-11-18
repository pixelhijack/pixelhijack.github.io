import path from 'path';
import fs from 'fs';
// --- Define ES Module Equivalents for CommonJS __dirname previously ---
import { fileURLToPath } from 'url'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ------------------------------------

// helper: load manifest for project and merge folder.json routes
export default function loadProjectManifest(projectName, baseDir) {
  const manifestPath = path.join(baseDir, 'projects', projectName, 'manifest.json');
  let manifest;
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } else {
    manifest = JSON.parse(fs.readFileSync(path.join(baseDir, 'projects', 'skeleton', 'missing-manifest.json')));
  }

  // ensure pages array exists
  manifest.pages = Array.isArray(manifest.pages) ? manifest.pages : [];

  // load folder.json (project-independent)
  const folderPath = path.join(baseDir, 'public', 'folder.json');
  let folderData = { flat: {} };
  if (fs.existsSync(folderPath)) {
    try {
      folderData = JSON.parse(fs.readFileSync(folderPath, 'utf8'));
    } catch (err) {
      console.warn('Could not parse folder.json, continuing with empty folder:', err.message);
    }
  }

  // merge folder routes into manifest.pages (avoid duplicates)
  Object.keys(folderData.flat || {}).forEach((route) => {
    if (!manifest.pages.find((p) => p && p.slug === route)) {
      manifest.pages.push({
        slug: route,
        tree: { source: route }
      });
    }
  });

  // optional: ensure a sitemap page exists (similar to client behavior)
  if (!manifest.pages.find(p => p && p.slug === 'sitemap')) {
    manifest.pages.push({
      slug: "sitemap",
      navColor: "white",
      background: "conceptual/botanic/DSC09953.jpg",
      tree: {
        type: "div",
        class: "pt-[120px] pl-[75px] min-h-screen flex flex-col items-left justify-center space-y-4 p-8",
        children: [
          {
            type: "h1",
            class: "text-4xl md:text-6xl font-ambroise mb-8",
            content: "Congrats hacker, you found all the pages"
          },
          // links generated from folder routes
          ...Object.keys(folderData.flat || {}).map(route => ({
            type: "a",
            href: `/${route}`,
            class: "text-1xl md:text-2xl font-bold text-white rounded-md",
            content: route
          }))
        ]
      }
    });
  }

  // attach raw folder data for client use if needed
  manifest._folder = folderData;

  return manifest;
}