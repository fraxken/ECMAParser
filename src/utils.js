/**
 * @func ASCIISet
 * @param  {Array<number | [number, number]>} plages plages
 * @returns {Set<Number>}
 */
function ASCIISet(...plages) {
    const ret = new Set();
    for (const plage of plages) {
        if (typeof plage === "number") {
            ret.add(plage);
            continue;
        }

        for (let tid = plage[0]; tid < plage[1]; tid++) {
            ret.add(tid);
        }
    }

    return ret;
}

/**
 * @func stringToChar
 * @param {!String} str string
 * @returns {Uint8Array}
 */
function stringToChar(str) {
    return new Uint8Array([...str].map((str) => str.charCodeAt(0)));
}

/**
 * @func compareU8Arr
 * @param {!Uint8Array} arrL 
 * @param {!Uint8Array} arrR
 * @returns {Boolean}
 */
function compareU8Arr(arrL, arrR) {
    if (arrL.byteLength !== arrR.byteLength) {
        return false;
    }

    for (let i = 0; i < arrL.length; i++) {
        if (arrL[i] !== arrR[i]) {
            return false;
        }
    }

    return true;
}

module.exports = { ASCIISet, stringToChar, compareU8Arr };