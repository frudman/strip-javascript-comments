
function xenhanceDefinedAMD(code) {
    var t = /ll\/*l/;
    log('RESULTING CODE:\n', enhanceDefinedAMD(code));
}

xenhanceDefinedAMD(`//sdfgsdfgsdfg

define(function() {
    noReal = code;

    var t = /ll\\/*l/;


    /a*/ // a valid regex in middle of nowehere

    return  /* com,mne t */
    abcx; // MUST remain on separate line
});
`);

xenhanceDefinedAMD(`//sdfgsdfgsdfg

define( [ ] ,   function() {
    //nothing here



    return   //eol comm
    abcx;
});`);

xenhanceDefinedAMD(`define( [ 'a','c','b'] ,   function() {
    q=1;
    // nothing here
});`);

xenhanceDefinedAMD(`define( [ 'a','c','b'] ,   function(a,b,c) {
    /*nothing here


    */
});`);

xenhanceDefinedAMD(`define( [ 'a','c','b'] ,   () => {
    //nothing here
});`);

xenhanceDefinedAMD(`define( [ 'a','c','b'] ,   async (a,b,c)=>{
    //nothing here
});`);

xenhanceDefinedAMD(`define( [ 'ttta','cqqq','require'] ,   (a,b,reqMe)=>{
    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=reqMe(   "dsfgdsfgsdfgsdf");
});`);

xenhanceDefinedAMD(`define( [ 'require', 'ttta','cqqq'] ,   (reqx, a,b,reqMe)=>{
    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=reqx(   "dsfgdsfgsdfgsdf"); // hellow???

    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=reqx(   "dsfgdsfgsdfgsdf");
});`);

xenhanceDefinedAMD(`define( [ 'ttta','require', 'cqqq'] ,   async (a,reqx, b,reqMe)=>{
    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=await reqx(   "dsfgdsfgsdfgsdf");

    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=reqx(   "dsfgdsfgsdfgsdf");
});`);

xenhanceDefinedAMD(`define( [ 'require', 'ttta','jquery'] ,   (reqx, a,b,$)=>{
    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=await reqx(   "dsfgdsfgsdfgsdf");

    const a = reqMe('dfgdsfgsdf'),
          dfgsdfsdf=    await reqx(   "dsfgdsfgsdfgsdf");
});`);

xenhanceDefinedAMD(``);

xenhanceDefinedAMD(``);
