import { useMemo, Fragment } from 'react';
import { Text } from '../typography';
import { TextLink } from '../cta';

const TEXT_SIZE_MAP = {
  1: "title-lg",
  2: "title-md",
  3: "title-sm",
  4: "paragraph-lg",
  5: "paragraph-md",
  6: "paragraph-md",
}

const sanitizeUrl = (url) => {
  if (!url) return '#';
  if (url.trim().toLowerCase().startsWith('javascript:')) return '#';
  return url;
};

// Simple inline markdown parser
const parseInline = (text) => {
  if (!text) return null;

  // We capture: links, bold, italic.
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return <TextLink key={index} as="anchor" to={sanitizeUrl(linkUrl)}>{parseInline(linkText)}</TextLink>;
    }

    // Bold: **text** or __text__
    const boldMatch = part.match(/^(\*\*|__)(.*?)\1$/);
    if (boldMatch) {
      return <b key={index} className="qb-markup-bold">{parseInline(boldMatch[2])}</b>;
    }

    // Italic: *text* or _text_
    const italicMatch = part.match(/^(\*|_)(.*?)\1$/);
    if (italicMatch) {
      return <i key={index} className="qb-markup-italic">{parseInline(italicMatch[2])}</i>;
    }

    // Plain text
    return <Fragment key={index}>{part}</Fragment>;
  });
};

const parseBlocks = (markdown) => {
  if (typeof markdown !== 'string') return markdown;

  // Normalize line endings
  const normalized = markdown.replace(/\r\n/g, '\n');

  // Split into blocks based on double newlines
  const blocks = normalized.split(/\n\n+/);

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Check for Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      return <Text key={index} weight="bold" type="heading" headingType={`h${level}`} size={TEXT_SIZE_MAP[level]} className="pb-3">{parseInline(content)}</Text>;
    }

    // Check for Unordered Lists
    if (/^[-*+]\s+/.test(trimmed)) {
      const items = trimmed.split(/\n/).map(line => line.replace(/^[-*+]\s+/, '').trim()).filter(Boolean);
      return (
        <ul key={index} className="qb-markup-ul qb-markup-list">
          {items.map((item, i) => (
            <li key={i} className="qb-markup-li">{parseInline(item)}</li>
          ))}
        </ul>
      );
    }

    // Check for Ordered Lists
    if (/^\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split(/\n/).map(line => line.replace(/^\d+\.\s+/, '').trim()).filter(Boolean);
      return (
        <ol key={index} className="qb-markup-ol qb-markup-list">
          {items.map((item, i) => (
            <li key={i} className="qb-markup-li">{parseInline(item)}</li>
          ))}
        </ol>
      );
    }

    // Default to Paragraph
    return (
      <Text key={index} className="pb-3">
        {trimmed.split('\n').map((line, i, arr) => (
          <Fragment key={i}>
            {parseInline(line)}
            {i < arr.length - 1 && <br />}
          </Fragment>
        ))}
      </Text>
    );
  });
};

export const Markdown = ({ children }) => {
  const parsedContent = useMemo(() => {
    if (typeof children !== 'string') return children;
    return parseBlocks(children);
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