// what we're testing
const stripComments = require('./strip-comments.js');

// what we're testing against
const TEST_CASES_FILES = ['./test-cases-pathological.js', './test-cases-data.js'];

// test cases are separated by this pattern: '// --- test case: [optional case title]'
const testcaseSepPat = /(^|\n)[/][/]\s*[-]*\s*test\s*case\s*[:]?/; 

const fs = require('fs'),
      log = console.log.bind(console),
      adorn = (txt, prefix) => prefix + txt.replace(/\n/g, '\n' + prefix);

TEST_CASES_FILES.forEach(file => fs.readFile(file, 'utf8', (err, data) => {
    log('CASES FROM: ' + file);
    var caseNum = 0;
    data.split(testcaseSepPat).filter((tc,i) => i > 0 && tc.trim()).forEach(tc => {
        const [m, title, code] = (tc+'\n').match(/(.*?\n)([^]*)/); // case title (optional) is first line
        log(`\n---Test Case #${++caseNum}: ${title}`
            + `${adorn(code.trim(), 'before-->  ')}\n\n${adorn(stripComments(code.trim()), 'after--->  ')}`
            +`\n---end-of-test-cases---\n`);
    });
}));