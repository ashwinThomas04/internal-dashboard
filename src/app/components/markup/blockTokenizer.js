// blockTokenizer.js
//
// Splits raw markdown text into an array of block tokens:
//   { type: 'heading', level, content }
//   { type: 'code', lang, content }
//   { type: 'ul' | 'ol', items: string[], start? }
//   { type: 'blockquote', content }
//   { type: 'hr' }
//   { type: 'paragraph', content }
//
// Fenced code blocks (```...```) are extracted FIRST, by scanning lines
// directly, before any blank-line block splitting happens. This is the
// fix for "markdown can have backticks": a fenced block's contents are
// never re-interpreted as headings/lists/emphasis, no matter what's inside.

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const UL_ITEM_RE = /^[-*+]\s+(.*)$/;
const OL_ITEM_RE = /^(\d+)\.\s+(.*)$/;
const HR_RE = /^([-*_])\s*(?:\1\s*){2,}$/;
const BLOCKQUOTE_RE = /^>\s?(.*)$/;
const FENCE_RE = /^(```|~~~)(\S*)\s*$/;

export const tokenizeBlocks = (markdown) => {
    if (typeof markdown !== 'string') return [];

    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const tokens = [];

    let i = 0;
    let paragraphBuf = [];
    let listBuf = null; // { type: 'ul' | 'ol', items: [], start }
    let quoteBuf = [];

    const flushParagraph = () => {
        if (paragraphBuf.length) {
            const content = paragraphBuf.join('\n').trim();
            if (content) tokens.push({ type: 'paragraph', content });
            paragraphBuf = [];
        }
    };

    const flushList = () => {
        if (listBuf && listBuf.items.length) {
            tokens.push(listBuf);
        }
        listBuf = null;
    };

    const flushQuote = () => {
        if (quoteBuf.length) {
            tokens.push({ type: 'blockquote', content: quoteBuf.join('\n').trim() });
            quoteBuf = [];
        }
    };

    const flushAll = () => {
        flushParagraph();
        flushList();
        flushQuote();
    };

    while (i < lines.length) {
        const line = lines[i];

        // --- Fenced code block: scan until matching closing fence, verbatim ---
        const fenceMatch = line.match(FENCE_RE);
        if (fenceMatch) {
            flushAll();
            const fenceChar = fenceMatch[1];
            const lang = fenceMatch[2] || '';
            const codeLines = [];
            i += 1;
            while (i < lines.length && lines[i].trim() !== fenceChar) {
                codeLines.push(lines[i]);
                i += 1;
            }
            // i now points at closing fence (or EOF if unterminated — treat as closed)
            tokens.push({ type: 'code', lang, content: codeLines.join('\n') });
            i += 1; // skip closing fence
            continue;
        }

        // --- Blank line: flush whatever paragraph/list/quote is open ---
        if (line.trim() === '') {
            flushAll();
            i += 1;
            continue;
        }

        // --- Heading ---
        const headingMatch = line.match(HEADING_RE);
        if (headingMatch) {
            flushAll();
            tokens.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2].trim() });
            i += 1;
            continue;
        }

        // --- Horizontal rule ---
        if (HR_RE.test(line.trim())) {
            flushAll();
            tokens.push({ type: 'hr' });
            i += 1;
            continue;
        }

        // --- Blockquote (consecutive '>' lines group together) ---
        const quoteMatch = line.match(BLOCKQUOTE_RE);
        if (quoteMatch) {
            flushParagraph();
            flushList();
            quoteBuf.push(quoteMatch[1]);
            i += 1;
            continue;
        }
        if (quoteBuf.length) flushQuote();

        // --- Unordered list item ---
        const ulMatch = line.match(UL_ITEM_RE);
        if (ulMatch) {
            flushParagraph();
            if (!listBuf || listBuf.type !== 'ul') {
                flushList();
                listBuf = { type: 'ul', items: [] };
            }
            listBuf.items.push(ulMatch[1].trim());
            i += 1;
            continue;
        }

        // --- Ordered list item ---
        const olMatch = line.match(OL_ITEM_RE);
        if (olMatch) {
            flushParagraph();
            if (!listBuf || listBuf.type !== 'ol') {
                flushList();
                listBuf = { type: 'ol', items: [], start: parseInt(olMatch[1], 10) };
            }
            listBuf.items.push(olMatch[2].trim());
            i += 1;
            continue;
        }

        // --- Lazy continuation: a non-blank line right after a list item
        //     with no marker is appended to the last list item (markdown rule) ---
        if (listBuf && listBuf.items.length && !/^\s*$/.test(line)) {
            listBuf.items[listBuf.items.length - 1] += ' ' + line.trim();
            i += 1;
            continue;
        }

        // --- Default: accumulate into paragraph buffer ---
        flushList();
        paragraphBuf.push(line);
        i += 1;
    }

    flushAll();
    return tokens;
};