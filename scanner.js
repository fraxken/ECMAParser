// Require Node.js Dependencies
const { readFileSync } = require("fs");

// Require Internal Dependencies
const { ASCIISet, stringToChar } = require("./src/utils");
const BufferString = require("./src/bufferstring");

// SYMBOLS & TOKENS
const T_KEYWORD = Symbol("T_KEYWORD");
const T_IDENTIFIER = Symbol("T_IDENTIFIER");
const T_SYMBOL = Symbol("T_SYMBOL");

// CHARACTERS & KEYWORDS
const C_SPACE = " ".charCodeAt(0);
const C_ENDLINE = ";".charCodeAt(0);

const KEYWORD_FUNCTION = stringToChar("function");
const KEYWORD_VAR = stringToChar("var");
const KEYWORD_LET = stringToChar("let");
const KEYWORD_CONST = stringToChar("const");

// CONSTANTS
const WIDE_CHARACTHER = ASCIISet([48, 57], [65, 90], [97, 122], 95, 36);
const OPERATORS = new Set([61, 43, 45, 69, 76]);

function* lex(buf) {
    const t8 = new BufferString();
    const sendToken = (token, value = null) => {
        t8.reset();

        return [token, value];
    }

    for (let i = 0; i < buf.length; i++) {
        const char = buf[i];
        if (char === C_SPACE) {
            continue;
        }

        if (OPERATORS.has(char)) {
            if (t8.currLen > 0) {
                yield sendToken(T_IDENTIFIER, t8.currValue);
            }
            yield sendToken(T_SYMBOL, char);
        }
        else if (WIDE_CHARACTHER.has(char)) {
            t8.add(char);
            
            if (t8.compare(KEYWORD_VAR)) {
                yield sendToken(T_KEYWORD, KEYWORD_VAR);
            }
            else if (t8.compare(KEYWORD_LET)) {
                yield sendToken(T_KEYWORD, KEYWORD_LET);
            }
            else if (t8.compare(KEYWORD_CONST)) {
                yield sendToken(T_KEYWORD, KEYWORD_CONST);
            }
            else if (t8.compare(KEYWORD_FUNCTION)) {
                yield sendToken(T_KEYWORD, KEYWORD_FUNCTION);
            }
        }
        else if (char === C_ENDLINE) {
            if (t8.currLen > 0) {
                yield sendToken(T_IDENTIFIER, t8.currValue);
            }
            yield sendToken(T_SYMBOL, C_ENDLINE);
        }
        else {
            if (t8.currLen === 0) {
                continue;
            }

            yield sendToken(T_IDENTIFIER, t8.currValue);
        }
    }
}

const buf = readFileSync("./sources/test.js");
console.time("lex");
for (const [token, value] of lex(buf)) {
    if (value instanceof Uint8Array) {
        console.log(token, String.fromCharCode(...value));
    }
    else {
        const tValue = typeof value === "number" ? String.fromCharCode(value) : value;
        console.log(token, tValue);
    }
}
console.timeEnd("lex");
