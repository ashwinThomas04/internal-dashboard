// inlineTokenizer.js
//
// Parses a single line/run of text into inline tokens:
//   { type: 'code', content }
//   { type: 'image', alt, url, title }
//   { type: 'link', text, url, title }
//   { type: 'bold', children: InlineToken[] }
//   { type: 'italic', children: InlineToken[] }
//   { type: 'text', content }
//
// CODE SPANS ARE TOKENIZED FIRST, as a separate pass, before bold/italic/link
// matching ever runs. This is the actual fix for "markdown can have backticks":
// once a `code span` is recognized, its contents are stored as an opaque
// text token and never re-entered into the regex pipeline below — so
// `**not bold**` or `[not a link](x)` inside backticks renders literally.

// Step 1: split on code spans (`...` or ``...``), protecting their contents.
const CODE_SPAN_RE = /(`{1,3})([^`]|[^`].*?[^`])\1(?!`)/g;

const splitCodeSpans = (text) => {
    const segments = [];
    let lastIndex = 0;
    let match;

    CODE_SPAN_RE.lastIndex = 0;
    while ((match = CODE_SPAN_RE.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ kind: 'raw', text: text.slice(lastIndex, match.index) });
        }
        segments.push({ kind: 'code', text: match[2] });
        lastIndex = CODE_SPAN_RE.lastIndex;
    }
    if (lastIndex < text.length) {
        segments.push({ kind: 'raw', text: text.slice(lastIndex) });
    }
    return segments;
};

// Step 2: within 'raw' segments only, match images/links/bold/italic with
// word-boundary-aware regex so "5 * 3 and 7 * 2" and "my_var_name" survive.
//
// Images use ![alt](url) — note the leading '!'. IMAGE_RE must be tried
// BEFORE LINK_RE: LINK_RE alone would still match the "[alt](url)" portion
// of an image and strand the '!' as plain text, silently turning images
// into mis-rendered links. Matching image first and treating it as a
// distinct token type avoids that.
const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/;
const LINK_RE = /\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/;
// Emphasis: marker must not be followed/preceded by whitespace at the inner edge
// (a simplified version of CommonMark's left/right-flanking delimiter rule).
const BOLD_STAR_RE = /\*\*(?!\s)([\s\S]+?)(?<!\s)\*\*/;
const ITALIC_STAR_RE = /\*(?!\s)([\s\S]+?)(?<!\s)\*/;
// Underscore emphasis additionally can't be intraword (my_var_name must stay literal) —
// CommonMark allows '_' delimiters only when NOT flanked by alphanumerics on the outside.
const BOLD_UNDERSCORE_RE = /(?<![\w])__(?!\s)([\s\S]+?)(?<!\s)__(?![\w])/;
const ITALIC_UNDERSCORE_RE = /(?<![\w])_(?!\s)([\s\S]+?)(?<!\s)_(?![\w])/;

const firstMatch = (text, res) => {
    for (const re of res) {
        const m = text.match(re);
        if (m) return m;
    }
    return null;
};

const tokenizeRaw = (text) => {
    if (!text) return [];

    // Image first — its match always wins over link/bold/italic at the
    // same position since LINK_RE could otherwise partially match inside it.
    const imageMatch = text.match(IMAGE_RE);
    const linkMatch = text.match(LINK_RE);
    const boldMatch = firstMatch(text, [BOLD_STAR_RE, BOLD_UNDERSCORE_RE]);
    const italicMatch = firstMatch(text, [ITALIC_STAR_RE, ITALIC_UNDERSCORE_RE]);

    // If link and image matched at the same index, it's the image's [..](..)
    // portion being re-matched by LINK_RE — discard the link match in that case.
    const linkIsActuallyImage = imageMatch && linkMatch && linkMatch.index === imageMatch.index + 1;

    // Pick whichever match starts earliest (so e.g. "plain **bold** [link](u)"
    // processes left-to-right correctly).
    const candidates = [
        imageMatch && { kind: 'image', match: imageMatch },
        linkMatch && !linkIsActuallyImage && { kind: 'link', match: linkMatch },
        boldMatch && { kind: 'bold', match: boldMatch },
        italicMatch && { kind: 'italic', match: italicMatch },
    ].filter(Boolean);

    if (!candidates.length) {
        return [{ type: 'text', content: text }];
    }

    candidates.sort((a, b) => a.match.index - b.match.index);
    const winner = candidates[0];
    const { match } = winner;
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match[0].length);

    const tokens = [];
    if (before) tokens.push({ type: 'text', content: before });

    if (winner.kind === 'image') {
        tokens.push({ type: 'image', alt: match[1], url: match[2], title: match[3] || '' });
    } else if (winner.kind === 'link') {
        tokens.push({ type: 'link', text: match[1], url: match[2], title: match[3] || '' });
    } else if (winner.kind === 'bold') {
        tokens.push({ type: 'bold', children: tokenizeInline(match[1]) });
    } else {
        tokens.push({ type: 'italic', children: tokenizeInline(match[1]) });
    }

    tokens.push(...tokenizeInline(after));
    return tokens;
};

export const tokenizeInline = (text) => {
    if (!text) return [];

    const segments = splitCodeSpans(text);
    const tokens = [];

    for (const seg of segments) {
        if (seg.kind === 'code') {
            tokens.push({ type: 'code', content: seg.text });
        } else if (seg.text) {
            tokens.push(...tokenizeRaw(seg.text));
        }
    }

    return tokens;
};