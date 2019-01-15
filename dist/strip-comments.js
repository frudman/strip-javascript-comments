(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stripComments", function() { return stripComments; });
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

/* harmony default export */ __webpack_exports__["default"] = (stripComments);

function stripComments(code) {

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


/***/ })
/******/ ]);
});