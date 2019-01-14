## STRIP-JAVASCRIPT-COMMENTS
---
A small & fast(ish) implementation of comment-removal from javascript source code.

There are MANY such implementation on the interwebz. All (that I'm aware of) fall into 2 camps:
1. Uses directly or indirectly a full javascript parser, often [esprima](http://esprima.org/)
2. Small direct implementation using character processing (including regular expressions)

### Parser-based Implementations
If your app can afford the first one, **this should definitely be your choice**. There is no better alternative than native parsing 
in order to correctly detect and remove comments from javascript code.
That's because javascript comments have a syntax that can make it indistinguishable from certain regular expressions (as per below).

A full parser will not get tripped up on "comments" inside strings or regular expressions.

### Non-Parser-based Implementations
The second class of comment removing algos are those created on-the-fly by developers like me who need something lighweight and don't want
to include a full parser in their distro (usually because of size constraints).

A simple implementation (using regex) can be only a few lines long ([this is a good example](https://stackoverflow.com/questions/3577767/javascript-comment-stripper) and there are **many many more** on the intertubes) but will usually fail in some cases, and this may be OK for your use cases. If you have some control over the code you're likely to clean, this may not be an issue. But if you need to handle edge cases, these minimal implementations may not work.

### My App Requirements
I implemented my own version because I could not include a large code base for what was a small requirement in our app but I wanted a more complete implementation than waht was out there. 

I also wanted a dead-simple function that did not use any options or settings (as many of the others do).

My implementation does a single thing: removes ALL comments from javascript code. That's it.

And the minified implementation is under 2k (1.6k last I checked).

[The closest to my implementation is this one, from lehni](https://github.com/lehni/uncomment.js). That version is also available 
from the [npm repo as uncomment](https://www.npmjs.com/package/uncomment).

My implementation handles edge cases that are ignored by many of the others. (please let me know if there was another implementation out there
that I missed that was lightweight and also handled all the edge cases below (and maybe more? :-))

**Please let me know if I missed some unhandled conditions.**

## Edge Cases ("pathological cases")

The following are cases that are difficult to handle for non-parser based comment removers.

### Strings in quotation marks

Many pure regex will consider strings as special cases but ignore some issues:
1. string quotes are themselves embedded as escaped characters in the string
2. many (__many__) algos recognize a SINGLE backslash in a string but not multiple ones
3. string quotes now include 'tick' marks (older algos that may not have been updated)

### Regular Expressions
All these cases are kept in the [pathological cases file](./test-cases-pathological.js)

#### Patho-case #1: [OK-BECAUSE-DETECTABLE-AND-AVOIDABLE]
This occurs when an odd number of backslashes preceeds what looks to be a comment start in a regular expression.
```
var pc1a = /succeeds with any-reg-exp \/*/  ; 
var pc1b = /succeeds with any-reg-exp \\\/*/  ; 
var pc1c = /succeeds with any-reg-exp \\\\\/*/  ; 
```
strip-comments WILL WORK CORRECTLY in these cases as it looks for backslash count in determining whether or not the slash-star is escaped or not.

#### Patho-case #2: [UNLIKELY but possible]
This occurs when a regex is immediately followed by an operator (multiplication `*` or division `/`). This is legal but does not make sense because it's not clear why anyone would want to multiply or divide a regular expression.

This is likely a user error, imo. Removing the second slash or the asterisk should clear up the case.

A syntax error WILL RESULT result from my comment stripping code:
```
var pc2a = /fails: trailing slash of regex lost->//g  ;
var pc2b = /fails: trailing slash of regex lost->/*g  ; // will steal everything until next */
```

#### Patho-case #3: [UNLIKELY but possible]
This occurs when a double-slash is used in a regular expression character matching expression, such as `[//]`. While this is legal, it's likely an error since there is no need to use the same character twice inside the `[]` operator.

This is likely an error, imo, and removing the second character will correct the situation.

A syntax error WILL RESULT result from my comment stripping code:
```
var pc3 = /fails: remainder of regex lost after ->[//] rest-of-regexp /  ;
```

#### Patho-case #4: [BAD-AND-UNVERIFIABLE]
This will happen if the exact sequence of character matching in a regular expression is `[/*]` which is valid and reasonable. Unfortunately, because I'm not using a full parser, I have no way to know I'm in a regex and so I cannot detect that sequence accurately.

**WORKAROUND** is to change `[/*]` to equivalent `[*/]` or `[\/*]`

A syntax error WILL RESULT result from my comment stripping code:
```
var pc4 = /fails: remainder of regex lost after ->[/*] rest-of-regexp/  ; // will steal everything until next */
```

#### Patho-case #5: [BAD-AND-UNVERIFIABLE]
This occurs is a valid comment immediately following a regular expression, which leads my code to STRIP THE WRONG slashes (first two, including end-of-regex slash, instead of following 2 chars).

**WORKAROUND** is to simply include a separator character (i.e. space, or semicolon) before the comment (which most developers would consider as good form anyway [ahemm...])


A syntax error WILL RESULT result from my comment stripping code:
```
var pc5a = /fails: trailing slash of regex lost->/// this is a valid EOL comment following a regex
var pc5b = /fails: trailing slash of regex lost->//* this is a valid multiline comment following a regex */
```

## Caveat

While my implementation does NOT cover the last 2 "path-cases," it WILL GENERATE A SYNTAX ERROR in the resulting code. This error can be caught and the suggested workaround used (if it wasn't an error in the first place).

For me, this compromise was adequate for the use cases of the app. Your requirements may differ.
