// what we're testing
const { stripComments } = require('./strip-comments.min.js');

// what we're testing against
const TEST_CASES_FILES = ['./test-cases-pathological.js', './test-cases-data.js'];

// test cases are separated using this pattern: '// --- test case: [optional case title]' \n test-case-code-follows
const testcaseSepPat = /(^|\n)[/][/]\s*[-]*\s*test\s*case\s*[:]?/; 

// format displayed code
const fmt = (txt, prefix) => prefix + txt.replace(/\n/g, '\n' + prefix);

TEST_CASES_FILES
    .forEach(file => require('fs').readFile(file, 'utf8', (err, data) => {

        console.log(`CASES FROM: ${file}`);
        
        var caseNum = 0;
        data.split(testcaseSepPat).filter((tc,i) => i > 0 && tc.trim()).forEach(tc => {
            const [m, title, code] = (tc+'\n').match(/(.*?\n)([^]*)/); // case title (optional) is first line
            console.log(`\n---Test Case #${++caseNum}: ${title}`
                        + `${fmt(code.trim(), 'before-->  ')}\n\n${fmt(stripComments(code.trim()), 'after--->  ')}`
                        +`\n---end-of-test-cases---\n`);
        });
    }));