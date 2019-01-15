//
// there are SERIOUS CAVEATS to be aware of when using this code (as per ./README.md)
//

/**
 * strip-comments.js - strips comments from javascript code
 *
 * Copyright (c) 2019+ Frederic Rudman
 *
 * Distributed under the MIT license.
 */

export default stripComments;

export function stripComments(code) {

    var strippedCode = '',
        pos = -1,
        spacingChar = null,
        inQuote = false, // becomes the quote's leading char (i.e. a 1-char string)
        inEOLComment = false,
        inMultilineComment = false,
        mlcStartPos = -1; // start pos if in a multiline comment

    const more = () => ++pos < code.length, // also increments to next char
          cur = () => (pos < code.length) ? code[pos] : ' ',
          next = () => (pos+1 < code.length) ? code[pos+1] : ' ',
          prev = () => (pos-1 >= 0) ? code[pos-1] : ' ',
          isSpaceChar = c => c === ' ' || c === '\n' || c === '\r' || c === '\t' || c === '\f', // other space chars?
          isQuoteChar = c => c === '"' || c === "'" || c === '`',
          validMLC = () => pos - 2 > mlcStartPos, // to prevent /*/ from being considered valid multiline-comment
          lastKeptChar = () => strippedCode.length > 0 ? strippedCode[strippedCode.length-1] : '',
          keep = c => strippedCode += c;

    // checking for escaped-quotes AND for patho-case #1
    var backslashes = 0;
    const evenNumberOfPrecedingBackSlashes = () =>  backslashes % 2 === 0; 

    while (more()) {
        const c = cur();

        if (inQuote) {
            keep(c);
            if (c === inQuote && evenNumberOfPrecedingBackSlashes()) // checking for escaped quotes
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
            spacingChar = (c === '\n' || spacingChar === '\n') ? '\n' : ' ';
        }
        else { 
            // first, handle prior spacing...
            if (spacingChar) { // ...if any
                (lastKeptChar() !== spacingChar) && keep(spacingChar); // collapse multiple ones into single
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
                else if (next() === '*' && evenNumberOfPrecedingBackSlashes()) { // checking for patho-case #1
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

        backslashes = (c === '\\') ? backslashes+1 : 0;
    }

    return strippedCode;
}
