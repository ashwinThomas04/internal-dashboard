import { useMemo, useState, Fragment } from 'react';
import { Text } from '../typography';
import { TextLink } from '../cta';
import { tokenizeBlocks } from './blockTokenizer';
import { tokenizeInline } from './inlineTokeniser';

const TEXT_SIZE_MAP = {
  1: 'title-lg',
  2: 'title-md',
  3: 'title-sm',
  4: 'paragraph-lg',
  5: 'paragraph-md',
  6: 'paragraph-md',
};

// Allowlist, not denylist: only schemes we trust are passed through.
// Protects against javascript:, data:, vbscript:, and obfuscation tricks
// (control chars, encoded entities) that a denylist regex would miss.
const SAFE_SCHEME_RE = /^(https?:|mailto:|tel:|#|\/)/i;
// Images: same idea, but '#' is meaningless as an <img src> so it's excluded.
// 'data:' is also still excluded — base64-embedded SVGs can carry <script>,
// so even for images we don't allow it through an allowlist meant for
// untrusted/user-generated content.
const SAFE_IMAGE_SCHEME_RE = /^(https?:|\/)/i;

const sanitizeUrl = (url) => {
  if (!url) return '#';
  const cleaned = url.trim().replace(/[\u0000-\u001F\u200B-\u200D]/g, '');
  return SAFE_SCHEME_RE.test(cleaned) ? cleaned : '#';
};

const sanitizeImageUrl = (url) => {
  if (!url) return null;
  const cleaned = url.trim().replace(/[\u0000-\u001F\u200B-\u200D]/g, '');
  return SAFE_IMAGE_SCHEME_RE.test(cleaned) ? cleaned : null;
};

// --- Inline rendering -------------------------------------------------

// Images render inline (markdown doesn't distinguish inline vs block images —
// they're an inline element that happens to often sit alone in a paragraph).
// Failed loads degrade to a small text fallback rather than the browser's
// broken-image icon sitting awkwardly in the content.
const InlineImage = ({ src, alt, title }) => {
  const [failed, setFailed] = useState(false);
  const safeSrc = sanitizeImageUrl(src);

  if (!safeSrc || failed) {
    return (
      <span className="qb-markup-image-fallback" role="img" aria-label={alt || 'image'}>
        [image{alt ? `: ${alt}` : ''} unavailable]
      </span>
    );
  }

  return (
    <img
      src={safeSrc}
      alt={alt || ''}
      title={title || undefined}
      loading="lazy"
      className="qb-markup-image"
      onError={() => setFailed(true)}
    />
  );
};

const renderInlineTokens = (tokens, keyPrefix = '') => {
  if (!tokens) return null;

  return tokens.map((token, i) => {
    const key = `${keyPrefix}-${i}`;

    switch (token.type) {
      case 'code':
        return (
          <code key={key} className="qb-markup-code-inline">
            {token.content}
          </code>
        );

      case 'image':
        return <InlineImage key={key} src={token.url} alt={token.alt} title={token.title} />;

      case 'link': {
        const linkTokens = tokenizeInline(token.text);
        return (
          <TextLink key={key} as="anchor" to={sanitizeUrl(token.url)} title={token.title || undefined} target="_blank" rel="noopener noreferrer">
            {renderInlineTokens(linkTokens, key)}
          </TextLink>
        );
      }

      case 'bold':
        return (
          <b key={key} className="qb-markup-bold">
            {renderInlineTokens(token.children, key)}
          </b>
        );

      case 'italic':
        return (
          <i key={key} className="qb-markup-italic">
            {renderInlineTokens(token.children, key)}
          </i>
        );

      case 'text':
      default:
        return <Fragment key={key}>{token.content}</Fragment>;
    }
  });
};

const renderInline = (text) => renderInlineTokens(tokenizeInline(text));

// --- Code block chrome: language label + copy button -----------------

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts / older browsers
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

const CodeBlock = ({ lang, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="qb-markup-code-block pb-3 mb-2">
      <div className="qb-markup-code-header">
        <span className="qb-markup-code-lang">{lang || 'text'}</span>
        <button
          type="button"
          className="qb-markup-code-copy"
          onClick={handleCopy}
          data-copied={copied}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <pre>
        <code className={lang ? `language-${lang}` : undefined}>{content}</code>
      </pre>
    </div>
  );
};

// --- Block rendering ----------------------------------------------------

const renderBlock = (block, index) => {
  switch (block.type) {
    case 'heading': {
      const level = block.level;
      return (
        <Text
          key={index}
          weight="bold"
          type="heading"
          headingType={`h${level}`}
          size={TEXT_SIZE_MAP[level]}
          className="pb-3"
        >
          {renderInline(block.content)}
        </Text>
      );
    }

    case 'code':
      return <CodeBlock key={index} lang={block.lang} content={block.content} />;

    case 'ul':
      return (
        <ul key={index} className="qb-markup-ul qb-markup-list">
          {block.items.map((item, i) => (
            <li key={i} className="qb-markup-li">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol key={index} start={block.start} className="qb-markup-ol qb-markup-list">
          {block.items.map((item, i) => (
            <li key={i} className="qb-markup-li">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );

    case 'blockquote':
      return (
        <blockquote key={index} className="qb-markup-blockquote pb-3">
          {block.content.split('\n').map((line, i, arr) => (
            <Fragment key={i}>
              {renderInline(line)}
              {i < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </blockquote>
      );

    case 'hr':
      return <hr key={index} className="qb-markup-hr" />;

    case 'paragraph':
    default:
      return (
        <Text key={index} className="pb-3">
          {block.content.split('\n').map((line, i, arr) => (
            <Fragment key={i}>
              {renderInline(line)}
              {i < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </Text>
      );
  }
};

// --- Public component -----------------------------------------------------
//
// Markdown is passed as a plain string PROP, not as JSX children via a
// template literal. This sidesteps the original "backticks break the
// children" problem entirely: `content` is just a JS string value (however
// it's produced — hardcoded, imported from a .md file, or fetched from a
// CMS/API at runtime) and is never parsed as JSX. Backticks, asterisks,
// brackets inside it are just characters in a string until tokenizeBlocks/
// tokenizeInline deliberately walk through them.
//
// `children` is still accepted as a fallback for call sites using the old
// <Markdown>{text}</Markdown> form, so this is a non-breaking upgrade.
export const Markdown = ({ content, children }) => {
  const source = typeof content === 'string'
    ? content
    : (typeof children === 'string' ? children : '');

  const blocks = useMemo(() => tokenizeBlocks(source), [source]);

  return (
    <div className="container py-5 qb-markup-container">
      <div className="row">
        <div className="col-12 col-md-10 offset-md-1">
          {blocks.map(renderBlock)}
        </div>
      </div>
    </div>
  );
};