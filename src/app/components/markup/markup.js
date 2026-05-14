import React, { useMemo } from 'react';
import { Text } from '../typography';
import { TextLink } from '../cta';

const ALLOWED_TAGS = ['b', 'i', 'u', 'strong', 'em', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'span', 'br', 'div'];
const TEXT_SIZE_MAP = {
  "h1": "title-lg",
  "h2": "title-md",
  "h3": "title-sm",
  "h4": "paragraph-lg",
  "h5": "paragraph-md",
  "h6": "paragraph-md",
}

const sanitizeNode = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const tag = node.tagName.toLowerCase();

  if (!ALLOWED_TAGS.includes(tag)) {
    return null;
  }

  const props = {};
  if (tag === 'a') {
    const href = node.getAttribute('href');
    if (href && !href.toLowerCase().trim().startsWith('javascript:')) {
      props.to = href;
    } else {
      props.to = '#';
    }
  }

  const children = Array.from(node.childNodes)
    .map((child, i) => {
      const parsed = sanitizeNode(child);
      if (parsed === null) return null;
      if (typeof parsed === 'string') return parsed;
      return React.cloneElement(parsed, { key: i });
    })
    .filter(Boolean);

  if (tag === 'a') {
    return <TextLink as="anchor" to={props.to}>{children}</TextLink>;
  } else if (['p', 'span', 'div'].includes(tag)) {
    return <Text type="content" className="pb-3">{children}</Text>;
  } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    return <Text type="heading" headingType={tag} className="pb-3" size={TEXT_SIZE_MAP[tag]} weight="bold">{children}</Text>;
  } else if (tag === 'ul' || tag === 'ol') {
    const Tag = tag;
    return <Tag className={`qb-markup-${tag}`}>{children}</Tag>;
  } else if (tag === 'li') {
    return <li className={`qb-markup-li`}>{children}</li>;
  } else if (['b', 'strong'].includes(tag)) {
    return <b className="qb-markup-bold">{children}</b>;
  } else if (['i', 'em'].includes(tag)) {
    return <i className="qb-markup-italic">{children}</i>;
  } else if (tag === 'u') {
    return <u className="qb-markup-underline">{children}</u>;
  } else if (tag === 'br') {
    return <br />;
  }

  return <>{children}</>;
};

export const Markup = ({ children }) => {
  const parsedContent = useMemo(() => {
    if (typeof children !== 'string') return children;

    if (typeof window === 'undefined' || !window.DOMParser) return children;

    const parser = new window.DOMParser();
    const doc = parser.parseFromString(children, 'text/html');

    return Array.from(doc.body.childNodes).map((node, i) => {
      const el = sanitizeNode(node);
      if (el && typeof el === 'object') {
        return React.cloneElement(el, { key: i });
      }
      return el;
    });
  }, [children]);

  return (
    <div className="container py-5 qb-markup-container">
      <div className="row">
        <div className="col-12 col-md-10 offset-md-1">
          {parsedContent}
        </div>
      </div>
    </div>
  )
}