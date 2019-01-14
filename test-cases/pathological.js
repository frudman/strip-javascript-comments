// TO EVERYONE: 
//    PLEASE LET ME KNOW if you find more cases where stripComments() fails.
// Thanks. 

/*
    stripComments WILL FAIL in some pathological cases, specifically where comments (eol, multiline), 
    ops (/,*), and regex "conflict" with each other

    there are:
    - 2 unlikely cases (not great, but likely errors from users: cases #2 & #3)
    - 2 UNAVOIDABLE cases (bad: cases #4 & #5)

    however:
    - All patho cases will generate a syntax error, so DETECTABLE (namely, resulting code will have errors)
    - All patho cases have simple workarounds
*/
    
// To illustrate the issues...
pathologicalCommentCases(); // ...is valid javascript BUT would be INCORRECTLY processed by stripComments()

// --- test case: PATHOLOGICAL CASES
function pathologicalCommentCases() {
    var g;

    // patho-case #1: [OK-BECAUSE-DETECTABLE-AND-AVOIDABLE]
    // - slash-star in regex; BUT it must be preceded by [odd number of] backslashes ('\') else invalid javascript
    // - so CORRECTLY handled by stripComments()
    var pc1a = /succeeds with any-reg-exp \/*/  ; 
    var pc1b = /succeeds with any-reg-exp \\\/*/  ; 
    var pc1c = /succeeds with any-reg-exp \\\\\/*/  ; 

    // patho-case #2: [UNLIKELY]
    // - regex immediately followed by op ('/' or '*'); but does not make sense (multiply or divide a regex?); 
    // - this is likely a user error...
    // - a syntax error will result from comment stripping
    var pc2a = /fails: trailing slash of regex lost->//g  ;
    var pc2b = /fails: trailing slash of regex lost->/*g  ; // will steal everything until next */

    // patho-case #3: [UNLIKELY]
    // - double-slash in regex char-matching; likely an error since same chars (so should be [/])
    // - a syntax error will result from comment stripping: invalid regexp
    var pc3 = /fails: remainder of regex lost after ->[//] rest-of-regexp /  ;

    // patho-case #4: [BAD-AND-UNVERIFIABLE]
    // - because we'd have to know we're in a regex (not a part of stripComments())
    // - workaround: change to [*/] or [\/*]
    // - a syntax error will result from comment stripping (to the end of next multi-line comment)
    var pc4 = /fails: remainder of regex lost after ->[/*] rest-of-regexp/  ; // will steal everything until next */

    // patho-case #5: [BAD-AND-UNVERIFIABLE]
    // - valid comment immediately following a regex; 
    // - so our code will STRIP WRONG slashes (first two, including end-of-regex slash, instead of following 2 chars)
    // - workaround: include a separator char before comment (i.e. space, or semicolon)
    // - a syntax error will result from comment stripping: invalid regexp
    var pc5a = /fails: trailing slash of regex lost->/// this is a valid EOL comment following a regex
    var pc5b = /fails: trailing slash of regex lost->//* this is a valid multiline comment following a regex */
}
