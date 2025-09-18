import React, { useEffect } from 'react';

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

function ensureMeta(nameOrProp: { name?: string; prop?: string }, content: string) {
  const head = document.head;
  let el: HTMLMetaElement | null = null;
  if (nameOrProp.name) {
    el = head.querySelector(`meta[name="${nameOrProp.name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.name = nameOrProp.name;
      head.appendChild(el);
    }
  } else if (nameOrProp.prop) {
    el = head.querySelector(`meta[property="${nameOrProp.prop}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', nameOrProp.prop);
      head.appendChild(el);
    }
  }
  if (el) el.content = content;
}

const MetaUpdater: React.FC<Props> = ({ title, description, image }) => {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const prevOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const prevOgDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    const prevOgImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
    const prevTwitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '';
    const prevTwitterDesc = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '';
    const prevTwitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

    if (title) document.title = title;
    if (description) ensureMeta({ name: 'description' }, description);
    if (title) ensureMeta({ prop: 'og:title' }, title);
    if (description) ensureMeta({ prop: 'og:description' }, description);
    if (image) ensureMeta({ prop: 'og:image' }, image);
    if (title) ensureMeta({ name: 'twitter:title' }, title);
    if (description) ensureMeta({ name: 'twitter:description' }, description);
    if (image) ensureMeta({ name: 'twitter:image' }, image);

    return () => {
      document.title = prevTitle;
      if (document.querySelector('meta[name="description"]'))
        document.querySelector('meta[name="description"]')!.setAttribute('content', prevDesc);
      if (document.querySelector('meta[property="og:title"]'))
        document.querySelector('meta[property="og:title"]')!.setAttribute('content', prevOgTitle);
      if (document.querySelector('meta[property="og:description"]'))
        document.querySelector('meta[property="og:description"]')!.setAttribute('content', prevOgDesc);
      if (document.querySelector('meta[property="og:image"]'))
        document.querySelector('meta[property="og:image"]')!.setAttribute('content', prevOgImage);
      if (document.querySelector('meta[name="twitter:title"]'))
        document.querySelector('meta[name="twitter:title"]')!.setAttribute('content', prevTwitterTitle);
      if (document.querySelector('meta[name="twitter:description"]'))
        document.querySelector('meta[name="twitter:description"]')!.setAttribute('content', prevTwitterDesc);
      if (document.querySelector('meta[name="twitter:image"]'))
        document.querySelector('meta[name="twitter:image"]')!.setAttribute('content', prevTwitterImage);
    };
  }, [title, description, image]);

  return null;
};

export default MetaUpdater;
