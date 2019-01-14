
// include test cases below...

// --- test case: uneven backslashes (single here)
function enhanceDefinedAMD(code) {
    var t = /ll\/*l/; // uneven backslashes (single here)
    log('RESULTING CODE:\n', enhanceDefinedAMD(code));
}

// --- test case: uneven backslashes (else invalid javascript)
// random comment to start

define(function() {
    noReal = code;

    var pc = /reg-exp \\\/*/  ; 
        var pc = /reg-exp \\\/*/  ; 
            var pc = /reg-exp \\\\\/*/  ; 


    var t = /ll\\\/*l/; // note: uneven backslashes (else invalid javascript)


    /a*/ // a valid regex in middle of nowehere

    return  /* multiline comment to make sure return has nothing following */
    abcx; // MUST remain on separate line
});

// --- test case: lots of empty lines collapsed into a single one
define( [ ] ,   function() {
    //nothing here


    

    // nothing there
    return   //eol comm
    abcx;
});

// --- test case:
enhanceDefinedAMD(`define( [ 'a','c','b'] , function() {
    q=1;
    // nothing here  "quoted   \" \' \` text}}}"
});`);

// --- test case:
enhanceDefinedAMD(`define( [ 'a','c','b'] , function(a,b,c) {
    /*nothing here

    \`  \`  \`

    */
   andThen = 'what???';
});`);

// --- test case:
enhanceDefinedAMD(`define( [ 'a','c','b'] ,  () => {
    //nothing here
});`);

// --- test case:
define( [ 'a','c','b'] ,  async (a,b,c)=>{
    //nothing here
});

// --- test case:
define(       [ 'ttta','cqqq','require'] ,        (a,b,reqMe)=>{
    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=reqMe(   "dsfgds\"fgs\'''dfgsdf");
});

// --- test case:
enhanceDefinedAMD(define( [   'require',  'ttta',  'cqqq'   ] ,        (reqx, a,b,reqMe)=>{
    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=reqx(   "dsfgdsfgsdfgsdf"); // hellow???

    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=reqx(   "dsfgdsfgsdfgsdf");
}));
