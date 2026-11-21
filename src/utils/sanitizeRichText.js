import { useEffect, useState } from "react";

// Dependency-free sanitizer for the few backend/admin fields that are allowed
// to contain formatting. It is an allowlist, not a blacklist: only the tags and
// attributes below survive, and everything else is unwrapped to plain text.
//
// Server render uses richTextToPlain(), which strips tags but deliberately
// leaves entities encoded so nothing becomes executable markup. After hydration
// the browser DOM parser does the real sanitisation. This avoids both a
// dangerous SSR sink and a hydration mismatch.

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "a",
  "span",
  "div",
  "hr",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
]);

// These are dropped with their contents. In particular no scripting, styling,
// embedding, form or SVG/MathML namespace tricks are allowed through.
const DROP_TAGS = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "applet",
  "svg",
  "math",
  "template",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "option",
  "video",
  "audio",
  "source",
  "track",
  "link",
  "meta",
  "base",
  "noscript",
  "frame",
  "frameset",
  "marquee",
  "portal",
]);

export const richTextToPlain = (html) => {
  if (typeof html !== "string" || !html) return "";
  // Do NOT decode entities here: the result may be used as innerHTML on the
  // server, and decoded `&lt;script&gt;` would become a live tag.
  return html.replace(/<[^>]*>/g, "");
};

export const sanitizeRichText = (html) => {
  if (typeof html !== "string" || !html) return "";
  if (typeof document === "undefined" || !document.implementation) return richTextToPlain(html);

  // An inert document: assigning innerHTML here cannot execute scripts.
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = html;

  const walk = (source, target) => {
    Array.from(source.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        if (child.nodeValue) target.appendChild(doc.createTextNode(child.nodeValue));
        return;
      }
      if (child.nodeType !== 1) return;

      const tag = child.tagName.toLowerCase();
      if (DROP_TAGS.has(tag)) return;

      if (!ALLOWED_TAGS.has(tag)) {
        // Unknown elements keep their text but lose every attribute.
        walk(child, target);
        return;
      }

      const clean = doc.createElement(tag);
      Array.from(child.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || "").trim();
        if (tag === "a" && name === "href") {
          // DOM decoding already neutralises entity-encoded schemes.
          if (/^(https?:|mailto:)/i.test(value) && !/[\u0000-\u001f]/.test(value)) {
            clean.setAttribute("href", value.slice(0, 2048));
          }
          clean.setAttribute("rel", "noopener noreferrer");
          return;
        }
        if (name === "class" || name === "title") {
          clean.setAttribute(name, value.slice(0, 200));
        }
        // `style`, `on*`, `src`, `srcset`, `target` etc. are intentionally
        // never copied.
      });

      walk(child, clean);
      target.appendChild(clean);
    });
  };

  const root = doc.createElement("div");
  walk(doc.body, root);
  return root.innerHTML;
};

export const useSanitizedRichText = (html) => {
  const [safe, setSafe] = useState(() => richTextToPlain(html));
  useEffect(() => {
    setSafe(sanitizeRichText(html));
  }, [html]);
  return safe;
};
