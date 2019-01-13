    //pathologicalCommentCases(); // works and would be INCORRECTLY processed by removeComments() method

    function pathologicalCommentCases() {
        
        // removeComments WILL FAIL in some pathological cases:
        // specifically where comments (eol, multiline), ops (/,*), and regex "conflict" with each other
        // - 2 unlikely cases (not great: cases #2 & #3)
        // - 2 UNDETECTABLE cases (bad: cases #4 & #5)

        var g;

        // patho-case #1: [OK-DETECTABLE] slash-star in regex; BUT must be preceded by '\' else invalid
        var pc = /reg-exp \/*/  ; // handled by our method

        // patho-case #2: [UNLIKELY] regex immediately followed by op ('/' or '*'); but does not make sense; 
        // - this is likely an error to begin with...
        // - a syntax error will result from comment stripping
        var pc = /ll//g  ;
        var pc = /ll/*g  ;

        // patho-case #3: [UNLIKELY] double-slash in regex char-matching; likely an error since same chars (so should be [/])
        // - a syntax error will result from comment stripping: invalid regexp
        var pc = /l [//]  l/  ;

        // patho-case #4: [BAD-AND-UNVERIFIABLE] because we'd have to know we're in a regex
        // - workaround: change to [*/] or [\/*]
        // - a syntax error will result from comment stripping (to the end of next multi-line comment)
        var pc = /l [/*] l/  ;

        // patho-case #5: [BAD-AND-UNVERIFIABLE] valid comment immediately following a regex; 
        // - so our code will STRIP WRONG slashes (first two, including end-of-regex slash, instead of following 2 chars)
        // - workaround: include a separator char before comment (i.e. space, or semicolon)
        // - a syntax error will result from comment stripping: invalid regexp
        var pc = /asdfasdfadfasdfdfgdsfgsdfg; /// this is a valid comment following a regex
        var pc = /asdfasdfadfasdfdfgdsfgsdfg; //* this is a valid comment following a regex */
    }
