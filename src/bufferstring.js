const U8_LEN = 255;

class BufferString {
    constructor() {
        this.u8Arr = new Uint8Array(U8_LEN);
        this.currLen = 0;
    }

    add(char) {
        if (this.currLen === 255) {
            throw new Error("Maximum length of '255' exceed");
        }

        this.u8Arr[this.currLen] = char;
        this.currLen++;
    }

    compare(u8) {
        if (this.currLen === 0 || this.currLen !== u8.byteLength) {
            return false;
        }
    
        for (let i = 0; i < this.currLen; i++) {
            if (this.u8Arr[i] !== u8[i]) {
                return false;
            }
        }
    
        return true;
    }

    get length() {
        return this.currLen;
    }

    get currValue() {
        if (this.currLen === 0) {
            return null;
        }

        return this.u8Arr.slice(0, this.currLen);
    }

    reset() {
        this.u8Arr = new Uint8Array(U8_LEN);
        this.currLen = 0;
    }
}

module.exports = BufferString;
