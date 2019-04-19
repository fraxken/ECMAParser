// Require Node.js Dependencies
const { readFileSync } = require("fs");

// Require Internal Dependencies
const { ASCIISet, stringToChar, compareU8Arr } = require("./src/utils");
const BufferString = require("./src/bufferstring");

// SYMBOLS & TOKENS
const END_EXPR = Symbol("T_END_EXPR");
const FUNC_OPEN = Symbol("T_FUNC_OPEN");
const VAR_DECLARATION = Symbol("T_VAR_DECLARATION");
const LET_DECLARATION = Symbol("T_LET_DECLARATION");
const CONST_DECLARATION = Symbol("T_CONST_DECLARATION");
const CHARS = Symbol("T_CHARS");
const OPERATOR = Symbol("T_OPERATOR");

const TOKENS = Object.freeze({
    END_EXPR,
    FUNC_OPEN,
    VAR_DECLARATION,
    LET_DECLARATION,
    CONST_DECLARATION,
    CHARS,
    OPERATOR
});

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
            const currValue = t8.currValue;
            if (currValue !== null) {
                yield sendToken(TOKENS.CHARS, currValue);
            }
            yield sendToken(TOKENS.OPERATOR, char);
        }
        else if (WIDE_CHARACTHER.has(char)) {
            t8.add(char);
            const currValue = t8.currValue;
            if (currValue === null) {
                continue;
            }
            
            if (compareU8Arr(currValue, KEYWORD_VAR)) {
                yield sendToken(TOKENS.VAR_DECLARATION);
            }
            else if (compareU8Arr(currValue, KEYWORD_LET)) {
                yield sendToken(TOKENS.LET_DECLARATION);
            }
            else if (compareU8Arr(currValue, KEYWORD_CONST)) {
                yield sendToken(TOKENS.CONST_DECLARATION);
            }
            else if (compareU8Arr(currValue, KEYWORD_FUNCTION)) {
                yield sendToken(TOKENS.FUNC_OPEN);
            }
        }
        else if (char === C_ENDLINE) {
            const currValue = t8.currValue;
            if (currValue !== null) {
                yield sendToken(TOKENS.CHARS, currValue);
            }
            yield sendToken(TOKENS.END_EXPR);
        }
        else {
            const currValue = t8.currValue;
            if (currValue === null) {
                continue;
            }

            yield sendToken(TOKENS.CHARS, currValue);
        }
    }
}

const buf = readFileSync("./sources/test.js");
console.time("lex");
for (const [token, value] of lex(buf)) {
    console.log(token, value instanceof Uint8Array ? String.fromCharCode(...value) : value);
}
console.timeEnd("lex");