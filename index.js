module.exports = function stripComments(code) {

    // there are SERIOUS CAVEATS to be aware of when using this code. Please read ./README.md

    var strippedCode = '',
        pos = -1,
        spacingChar = null,
        inQuote = false, // becomes the quote's leading char (i.e. a 1-char string)
        inEOLComment = false,
        inMultilineComment = false,
        mlcStartPos = -1;

    const more = () => ++pos < code.length, // also increments to next char
          cur = () => (pos < code.length) ? code[pos] : ' ',
          next = () => (pos+1 < code.length) ? code[pos+1] : ' ',
          prev = () => (pos-1 >= 0) ? code[pos-1] : ' ',
          prevPrev = () => (pos-2 >= 0) ? code[pos-2] : ' ',
          isSpaceChar = c => c === ' ' || c === '\n' || c === '\r' || c === '\t' || c === '\f', // other space chars?
          isQuoteChar = c => c === '"' || c === "'" || c === '`',
          validMLC = () => pos - 2 > mlcStartPos, // to prevent /*/ from being considered valid multiline-comment
          keep = c => strippedCode += c;

    while (more()) {
        const c = cur();
        if (inQuote) {
            keep(c);
            if (c === inQuote && (prev() !== '\\' || prevPrev() !== '\\'))
                inQuote = false;
        }
        else if (inEOLComment) {
            if (c === '\n') {
                inEOLComment = false;
                spacingChar = '\n';
            }
        }
        else if (inMultilineComment) {
            if (c === '/' && prev() === '*' && validMLC()) { // /*/*/ is valid; /*/ is not
                inMultilineComment = false;
                spacingChar = ' ';
            }
        }
        else if (isSpaceChar(c)) {
            spacingChar = (c === '\n') ? '\n' : (spacingChar === '\n') ? '\n' : ' ';
        }
        else { 
            // first, handle prior spacing...
            if (spacingChar) { // ...if any
                keep(spacingChar);
                spacingChar = null;
            }

            // then, consider next char...
            if (isQuoteChar(c)) {
                keep(c);
                inQuote = c; // now in a quote (to be terminated by same char)
            }
            else if (c === '/') { 
                if (next() === '/')
                    inEOLComment = true;
                else if (next() === '*' && prev() !== '\\') { // prev() check is for patho-case #1
                    inMultilineComment = true;
                    mlcStartPos = pos; // remember its start: a ml-comment must be at least 4 chars long (incl. /* and */)
                }
                else
                    keep(c);
            }
            else {
                keep(c);
            }
        }
    }

    return strippedCode;
}
