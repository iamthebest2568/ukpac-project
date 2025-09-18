import React, { useEffect } from "react";

import React, { useEffect } from "react";

interface Props {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  hreflang?: string; // e.g. 'th'
  locale?: string; // e.g. 'th_TH'
}

function ensureMeta(
  nameOrProp: { name?: string; prop?: string },
  content: string,
) {
  const head = document.head;
  let el: HTMLMetaElement | null = null;
  if (nameOrProp.name) {
    el = head.querySelector(`meta[name="${nameOrProp.name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.name = nameOrProp.name;
      head.appendChild(el);
    }
  } else if (nameOrProp.prop) {
    el = head.querySelector(`meta[property="${nameOrProp.prop}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", nameOrProp.prop);
      head.appendChild(el);
    }
  }
  if (el) el.content = content;
}

function ensureLink(rel: string, attrs: Record<string, string>) {
  const head = document.head;
  const selector = Object.entries(attrs)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join("");
  let el = head.querySelector(`link[rel="${rel}"]${selector}`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    head.appendChild(el);
  }
  return el;
}

const MetaUpdater: React.FC<Props> = ({ title, description, image, canonical, hreflang, locale }) => {
  useEffect(() => {
    const head = document.head;
    const prevTitle = document.title;

    const prev = {
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
      ogDesc: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '',
      twitterDesc: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '',
      twitterImage: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
      ogLocale: document.querySelector('meta[property="og:locale"]')?.getAttribute('content') || '',
    };

    // defaults
    const finalCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : '');
    const finalLocale = locale || 'th_TH';

    if (title) document.title = title;
    if (description) ensureMeta({ name: 'description' }, description);
    if (title) ensureMeta({ prop: 'og:title' }, title);
    if (description) ensureMeta({ prop: 'og:description' }, description);
    if (image) ensureMeta({ prop: 'og:image' }, image);
    if (title) ensureMeta({ name: 'twitter:title' }, title);
    if (description) ensureMeta({ name: 'twitter:description' }, description);
    if (image) ensureMeta({ name: 'twitter:image' }, image);

    // og:locale
    ensureMeta({ prop: 'og:locale' }, finalLocale);

    // canonical
    const canonicalEl = ensureLink('canonical', { href: finalCanonical });

    // hreflang (optional)
    let hreflangEl: HTMLLinkElement | null = null;
    if (hreflang) {
      hreflangEl = ensureLink('alternate', { href: finalCanonical, hreflang });
    }

    // JSON-LD: WebSite + Organization
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      name: title || document.title || 'UK PACT',
      inLanguage: finalLocale,
      description: description || '',
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-meta-updater', 'true');
    script.text = JSON.stringify(ld);
    head.appendChild(script);

    return () => {
      document.title = prevTitle;
      if (description) {
        const desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute('content', prev.description);
      }
      if (title) {
        const ot = document.querySelector('meta[property="og:title"]');
        if (ot) ot.setAttribute('content', prev.ogTitle);
      }
      if (description) {
        const od = document.querySelector('meta[property="og:description"]');
        if (od) od.setAttribute('content', prev.ogDesc);
      }
      if (image) {
        const oi = document.querySelector('meta[property="og:image"]');
        if (oi) oi.setAttribute('content', prev.ogImage);
      }
      const tt = document.querySelector('meta[name="twitter:title"]');
      if (tt) tt.setAttribute('content', prev.twitterTitle);
      const td = document.querySelector('meta[name="twitter:description"]');
      if (td) td.setAttribute('content', prev.twitterDesc);
      const ti = document.querySelector('meta[name="twitter:image"]');
      if (ti) ti.setAttribute('content', prev.twitterImage);

      // restore og:locale
      const ol = document.querySelector('meta[property="og:locale"]');
      if (ol) ol.setAttribute('content', prev.ogLocale);

      // remove canonical/hreflang if we created them (only if href equals finalCanonical)
      try {
        const ce = document.querySelector('link[rel="canonical"]');
        if (ce && ce.getAttribute('href') === finalCanonical && prev.canonical === '') ce.remove();
        if (hreflangEl) {
          const he = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
          if (he && he.getAttribute('href') === finalCanonical) he.remove();
        }
      } catch (e) {}

      // remove injected JSON-LD
      const injected = document.querySelectorAll('script[data-meta-updater]');
      injected.forEach((s) => s.remove());
    };
  }, [title, description, image, canonical, hreflang, locale]);

  return null;
};

export default MetaUpdater;
