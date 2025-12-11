/**
 * Generate checkbox manifest objects from an array of topic strings
 * 
 * @param {string[]} topics - Array of topic strings
 * @param {string} prefix - Optional prefix for slugs (e.g., 'ai_alapok')
 * @returns {Array} Array of manifest objects for checkboxes with labels
 * 
 * Usage:
 * const topics = [
 *   "Mennyire okos az AI? Hogyan nem ért dolgokat?",
 *   "Milyen feladatokra használható az AI?",
 *   "Mik az AI korlátai?"
 * ];
 * 
 * const checkboxManifest = generateCheckboxes(topics, 'ai_basics');
 */

export function generateCheckboxes(topics, prefix = '') {
  const result = [];
  
  topics.forEach((topic, index) => {
    // Create slug from topic text
    const slug = slugify(topic);
    const id = 'munkaban/vallalkozas/' + index; // prefix ? `${prefix}_${slug}` : slug;
    
    // Checkbox input
    result.push({
      type: "input",
      typeAttr: "checkbox",
      id: id,
      name: id,
      class: "mr-2",
      "data-label": topic  // Store full text for server processing
    });
    
    // Label
    result.push({
      type: "label",
      for: id,
      content: topic,
      class: "text-lg cursor-pointer"
    });
    
    // Line break for spacing
    result.push({
      type: "br"
    });
  });
  
  return result;
}

/**
 * Convert text to URL-friendly slug
 * Handles Hungarian characters
 */
function slugify(text) {
  const hungarianMap = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ö': 'o', 'ő': 'o', 'ú': 'u', 'ü': 'u', 'ű': 'u',
    'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ö': 'o', 'Ő': 'o', 'Ú': 'u', 'Ü': 'u', 'Ű': 'u'
  };
  
  return text
    .toLowerCase()
    .split('')
    .map(char => hungarianMap[char] || char)
    .join('')
    .replace(/[^\w\s-]/g, '')  // Remove special chars
    .replace(/\s+/g, '_')       // Replace spaces with underscores
    .replace(/-+/g, '_')        // Replace hyphens with underscores
    .replace(/^_+|_+$/g, '')    // Trim underscores
    .substring(0, 50);          // Limit length
}

/**
 * CLI usage - run this file directly to generate manifest JSON
 * node utils/generateCheckboxes.js
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleTopics = [
    "Anyuka vagy otthon, és szeretnél valami új dolgot kitanulni, kipróbálni?",
    "Vállalkozni szeretnél, de nincs ötleted, mivel indulj el?",
    "Vagy kifejezetten sok ötleted lenne, de nem tudod, melyik lehetne piacképes?",
    "Van egy különösen jó ötleted, amit szívesen megvalósítanál, de nem tudod, hogyan kezdj hozzá?",
    "Esetleg már van is valamilyen hobbid, tevékenységed amit tovább fejlesztenél, de jó lenne ha bevételed is lehetne belőle?",
  ];
  
  const manifest = generateCheckboxes(exampleTopics, 'ai_alapok');
  console.log(JSON.stringify(manifest, null, 2));
}

export default generateCheckboxes;
