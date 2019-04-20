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

const KEYWORD_FUNCTION = stringToChar("function");
const KEYWORD_VAR = stringToChar("var");
const KEYWORD_LET = stringToChar("let");
const KEYWORD_CONST = stringToChar("const");
const KEYWORD_RETURN = stringToChar("return");

// CONSTANTS
const WIDE_CHARACTHER = ASCIISet([48, 57], [65, 90], [97, 122], 95, 36, 39, 34);
const OPERATORS = new Set([61, 43, 45, 69, 76]);
const KEYWORDS = [KEYWORD_VAR, KEYWORD_CONST, KEYWORD_LET, KEYWORD_FUNCTION, KEYWORD_RETURN];
const SYMBOLS = new Set([";", "{", "}", "(", ")"].map((char) => char.charCodeAt(0)));

/**
 * @func isKeyword
 * @param {!BufferString} bufString 
 * @returns {boolean}
 */
function isKeyword(bufString) {
    for (let i = 0; i < KEYWORDS.length; i++) {
        if (bufString.compare(KEYWORDS[i])) {
            return [true, KEYWORDS[i]];
        }
    }

    return [false, null];
}

function* lex(buf) {
    const t8 = new BufferString();

    for (let i = 0; i < buf.length; i++) {
        const char = buf[i];
        if (WIDE_CHARACTHER.has(char)) {
            t8.add(char);
            continue;
        }

        if (t8.length > 0) {
            const [currIsKeyword, u8Keyword] = isKeyword(t8);
            if (currIsKeyword) {
                t8.reset();
                yield [T_KEYWORD, u8Keyword];
                continue;
            }
            if (char === C_SPACE) {
                t8.add(char);
                continue;
            }

            const currValue = t8.currValue;
            t8.reset();
            yield [T_IDENTIFIER, currValue];
        }

        if (SYMBOLS.has(char)) {
            yield [T_SYMBOL, char];
        }
        else if (OPERATORS.has(char)) {
            yield [T_SYMBOL, char];
        }
    }
}

const buf = readFileSync("./sources/test.js");
for (const [token, value] of lex(buf)) {
    if (value instanceof Uint8Array) {
        console.log(token, String.fromCharCode(...value));
    }
    else {
        const tValue = typeof value === "number" ? String.fromCharCode(value) : value;
        console.log(token, tValue);
    }
}
