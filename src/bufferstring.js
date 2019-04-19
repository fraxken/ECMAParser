class BufferString {
    constructor() {
        this.u8Arr = new Uint8Array(255);
        this.currLen = 0;
    }

    add(char) {
        if (this.currLen === 255) {
            throw new Error("Maximum length of '255' exceed");
        }

        this.u8Arr[this.currLen] = char;
        this.currLen++;
    }

    get currValue() {
        if (this.currLen === 0) {
            return null;
        }

        return this.u8Arr.slice(0, this.currLen);
    }

    reset() {
        this.u8Arr = new Uint8Array(255);
        this.currLen = 0;
    }
}

module.exports = BufferString;
