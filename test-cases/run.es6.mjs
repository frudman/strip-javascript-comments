// what we're testing
import stripComments from '../index.mjs';
import fs from 'fs';

// what we're testing against
const TEST_CASES_FILES = ['./test-cases/pathological.js', './test-cases/data.js'];

// each test case is preceded with this pattern: '// --- test case: [optional case title] \n [test-case-code-follows]'
const testcaseSepPat = /(^|\n)[/][/]\s*[-]*\s*test\s*case\s*[:]?/; 

// format displayed code
const fmt = (prefix, txt) => prefix + txt.replace(/\n/g, '\n' + prefix);

TEST_CASES_FILES
    .forEach(file => fs.readFile(file, 'utf8', (err, data) => {

        console.log(`CASES FROM: ${file}`);
        
        var caseNum = 0;
        data.split(testcaseSepPat).filter((tc,i) => i > 0 && tc.trim()).forEach(tc => {
            const [m, title, code] = (tc+'\n').match(/(.*?\n)([^]*)/);
            console.log(`\n---Test Case #${++caseNum}: ${title}`
                        + `${fmt('before-->  ', code.trim())}\n\n${fmt('after--->  ', stripComments(code.trim()))}`
                        +`\n---end-of-test-cases---\n`);
        });
    }));