import path from 'path';
import fs from 'fs';
import { marked } from 'marked';

const PROJECT = process.env.PROJECT_NAME || 'photographer';

marked.setOptions({
  breaks: true,        // Convert \n to <br>
  gfm: true,          // GitHub Flavored Markdown
  headerIds: true,    // Add IDs to headers
  mangle: false,      // Don't escape email addresses
  pedantic: false,    // Don't be overly strict
});

export function getImageSrcServer(filename) {
  if (!filename) return '';
  if (process.env.NODE_ENV === 'development') return `/img/${filename}`;
  return `https://res.cloudinary.com/dg7vg50i9/image/upload/f_auto,q_auto/${filename}`;
}

export default function renderTreeServer(node, manifest, baseDir) {
  if (!node) return '';

  // map style guide shorthand
  if (node.class && manifest?.styleGuide && manifest.styleGuide[node.class]) {
    node.class = manifest.styleGuide[node.class];
  }

  // handle markdown type
  if (node.type === "markdown" && node.file) {
    const mdPath = path.join(baseDir, 'projects', PROJECT, 'markdown', node.file);
    
    let markdownContent = '';
    if (fs.existsSync(mdPath)) {
      try {
        const rawMd = fs.readFileSync(mdPath, 'utf8');
        markdownContent = marked.parse(rawMd);
      } catch (err) {
        console.error(`Failed to parse markdown file: ${node.file}`, err.message);
        markdownContent = `<p class="hidden">md? ${node.file}</p>`;
      }
    } else {
      console.warn(`Markdown file not found: ${mdPath}`);
      markdownContent = `<p class="hidden">md? ${node.file}</p>`;
    }
    
    // render as a div with the markdown HTML content
    const classProp = node.class ? ` class="markdown ${node.class}"` : '';
    return `<div${classProp}>${markdownContent}</div>`;
  }

  // handle source -> children population (folder.json)
  if (node.source) {
    const arr = manifest?._folder?.flat?.[node.source] || [];
    node.children = arr.map(img => ({
      type: "img",
      src: `${node.source}/${img}`,
      alt: img,
    }))
    // shuffle if you want same behavior as client (optional)
    .map(value => ({ value, sort: Math.random() }))
    .sort((a,b) => a.sort - b.sort)
    .map(({value}) => value);
  }

  if (node.type === undefined) node.type = "div";
  if (node.type === "text") return node.content || "";

  if (node.meta) {
    node.children = node.children || [];
    node.children.splice(1, 0, {
      type: "div",
      class: "m-[20px] text-2xl font-eb-garamond text-black mx-auto text-left max-w-[70%]",
      content: node.meta
    });
  }

  if (node.type === "background") {
    const bgImage = getImageSrcServer(node.src);
    let extraStyle = `background-image: url(${bgImage}); background-size: cover; background-position: center;`;
    extraStyle += "width: 100%; height: 100vh;";
    const classProp = node.class ? ` class="${node.class}"` : "";
    const styleProp = ` style="${extraStyle}"`;
    let childrenStr = "";
    if (Array.isArray(node.children)) childrenStr = node.children.map(child => renderTreeServer(child, manifest, baseDir)).join("");
    return `<div${classProp}${styleProp}>${node.content || ""}${childrenStr}</div>`;
  }

  // inputs
  if (node.type === "input") {
    const type = node.typeAttr || "text";
    const attrs = [];
    attrs.push(`type="${type}"`);
    if (node.name) attrs.push(`name="${node.name}"`);
    if (node.value !== undefined) attrs.push(`value="${node.value}"`);
    if (node.placeholder) attrs.push(`placeholder="${node.placeholder}"`);
    if (node.class) attrs.push(`class="${node.class}"`);
    if (node.id) attrs.push(`id="${node.id}"`);
    if (node.required) attrs.push(`required`);
    if (node.checked) attrs.push(`checked`);
    const reserved = ["type","children","content","class","style","src","alt","meta","caption","captionStyle","linkTo","source","typeAttr"];
    Object.keys(node).forEach(k => {
      if (!reserved.includes(k) && typeof node[k] === "string") attrs.push(`${k}="${node[k]}"`);
    });
    return `<input ${attrs.join(" ")}/>`;
  }

  if (node.type === "select") {
    const attrs = [];
    if (node.name) attrs.push(`name="${node.name}"`);
    if (node.class) attrs.push(`class="${node.class}"`);
    if (node.multiple) attrs.push(`multiple`);
    if (node.id) attrs.push(`id="${node.id}"`);
    let optionsHtml = "";
    (node.children || []).forEach(opt => {
      if (opt.type === "option") {
        const val = opt.value !== undefined ? opt.value : (opt.content || "");
        const selected = node.value !== undefined && String(node.value) === String(val) ? ' selected' : (opt.selected ? ' selected' : '');
        const optClass = opt.class ? ` class="${opt.class}"` : '';
        optionsHtml += `<option value="${val}"${selected}${optClass}>${opt.content || val}</option>`;
      }
    });
    return `<select ${attrs.join(" ")}>${optionsHtml}</select>`;
  }

  if (node.type === "img") {
    const imgProps = [];
    if (node.src) {
      if (typeof node.src === "string") imgProps.push(`src="${getImageSrcServer(node.src)}"`);
      else if (Array.isArray(node.src)) {
        const randomSrc = node.src[Math.floor(Math.random()*node.src.length)];
        imgProps.push(`src="${getImageSrcServer(randomSrc)}"`);
      }
    } else {
      console.warn("Image node missing 'src' property:", node);
    }
    if (node.alt) imgProps.push(`alt="${node.alt}"`);
    if (node.class) imgProps.push(`class="${node.class}"`);
    imgProps.push('loading="lazy"');
    const reservedImg = ["type","children","content","class","style","src","alt","caption","captionStyle"];
    Object.keys(node).forEach(key => {
      if (!reservedImg.includes(key) && typeof node[key] === "string") {
        imgProps.push(`${key}="${node[key]}"`);
      }
    });
    let imageHTML = "";
    if (node.caption) {
      const figCaptionProps = node.captionStyle ? ` class="${node.captionStyle}"` : "";
      imageHTML = `<figure><img ${imgProps.join(" ")}/><figcaption${figCaptionProps}>${node.caption}</figcaption></figure>`;
    } else {
      imageHTML = `<img ${imgProps.join(" ")}/>`;
    }
    if (node.linkTo) imageHTML = `<a href="/${node.linkTo}">${imageHTML}</a>`;
    return imageHTML;
  }

  // generic element
  const propsArr = [];
  if (node.class) propsArr.push(`class="${node.class}"`);

  let styleObj = {};
  if (node.style) styleObj = node.style;
  if (node.textColor) styleObj = { ...styleObj, color: node.textColor };
  const styleStr = Object.entries(styleObj).map(([k,v]) => `${k}:${v}`).join(";");
  if (styleStr) propsArr.push(`style="${styleStr}"`);

  const reserved = ["type","children","content","class","style","src","alt","caption","captionStyle","typeAttr"];
  Object.keys(node).forEach(key => {
    if (!reserved.includes(key) && typeof node[key] === "string") {
      propsArr.push(`${key}="${node[key]}"`);
    }
  });

  const propsStr = propsArr.length ? " " + propsArr.join(" ") : "";
  let childrenStr = "";
  if (Array.isArray(node.children)) childrenStr = node.children.map(child => renderTreeServer(child, manifest, baseDir)).join("");
  const selfClosing = ["img","br","hr","input","meta","link"];
  if (selfClosing.includes(node.type)) return `<${node.type}${propsStr}/>`;
  return `<${node.type}${propsStr}>${node.content || ""}${childrenStr}</${node.type}>`;
}