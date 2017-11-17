/**
 * @author Hector J. Vasquez <ipi.vasquez@gmail.com>
 *
 * @licence
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// The number of bit in each elements of the array
const PER_ELEM_BITS = 8 * Uint32Array.BYTES_PER_ELEMENT;
// A constant for fill elements with every bit on
const FULL_ELEM = 0xFFFFFFFF;

/**
 * A representation of a BitSet. It works as an array of booleans by handling
 * the bits of the integers. When the quantity of bits is greater than 32, it
 * opens another position in the array.
 */
export default class BitSet {
    // Represents the bit set
    private _buffer: Uint32Array;
    // The number of bits on in this
    private _numOn = 0;
    // The size of the bit set
    private _size = 0;

    /**
     * Builds this with a default array size of 1, that means 32 bits.
     * @param size The size for this.
     * @param buffer A buffer previously set if it is required.
     */
    constructor(size: number = 1, buffer?: ArrayBuffer) {
        if (buffer) {
            this.setFromBuffer(buffer, size);
        } else {
            this.size = size;
        }
    }

    /**
     * Gets the bit value at i.
     * @param i The bit to get.
     * @return this[i].
     */
    public get(i: number): boolean {
        return (this._buffer[elementIndex(i)] & (1 << bitPlace(i))) !== 0;
    }

    /**
     * Sets the bit at i position to a given value.
     * @param i The bit to be set.
     * @param value The value for the bit.
     */
    public set(i: number, value: boolean): void {
        // If this.size is less than the expected, updates size
        if (value && this.size <= i) {
            this.size = (i + 1);
        }

        const existing = this.get(i);
        if (value === existing) {
            return;
        }
        if (value) {
            this._buffer[elementIndex(i)] |= 1 << bitPlace(i);
        } else {
            this._buffer[elementIndex(i)] &= ~(1 << bitPlace(i));
        }
        // Updates number of bits on
        this._numOn += value ? 1 : -1;
    }

    /**
     * Sets all bit in this to a given value.
     * @param value The new value for all bits in this.
     */
    public setAll(value: boolean): void {
        const overhang = this._size % PER_ELEM_BITS;

        if (overhang === 0 || !value) {
            fill(this._buffer, value ? FULL_ELEM : 0);
        } else { // fill up to overhang, write last elem manually
            fill(this._buffer, FULL_ELEM, this._buffer.length - 1);
            this._buffer[this._buffer.length - 1] = (1 << overhang) - 1;
        }
        // Updates number of bits on
        this._numOn = value ? this._size : 0;
    }

    /**
     * Sets the bits of this bitset as the bits of a given buffer.
     * @param buffer The buffer to copy in this bitset.
     * @param size The size of the buffer.
     */
    public setFromBuffer(buffer: ArrayBuffer, size: number) {
        this._buffer = new Uint32Array(buffer);
        this._size = size;
        this._numOn = bitsOn(this._buffer, size);
    }

    /**
     * Clones this bitset.
     * @return A copy of this bitset.
     */
    public clone() {
        return new BitSet(this.size, this.buffer);
    }

    /**
     * Returns whether any of the bits is set.
     * @return true if there is any bit on in this, false otherwise.
     */
    public any(): boolean {
        return this.numOn > 0;
    }

    /**
     * Returns whether all of the bits are set.
     * @return true if all the bits are set, false otherwise.
     */
    public all(): boolean {
        return this.numOn === this.size;
    }

    /**
     * Returns whether none of the bits is set.
     * @return true if none of the bits in the bitset is set, false
     * otherwise.
     */
    public none(): boolean {
        return !this.any();
    }

    /**
     * Returns the size of the bitset.
     * @return The size of this bitset.
     */
    get size(): number {
        return this._size;
    }

    /**
     * Sets the size of this bitset to a given size.
     * @param size The new size for this bitset.
     */
    set size(size: number) {
        if (size === this._size) {
            return;
        }

        const oldBuf = this._buffer;
        const newBuf = this._buffer = new Uint32Array(nElementsNeeded(size));
        this._size = size;
        if (oldBuf) {
            if (newBuf.length < oldBuf.length) {
                newBuf.set(oldBuf.subarray(0, newBuf.length));
                // clear bits above the overhang
                const numOverhang = size % PER_ELEM_BITS;
                if (numOverhang > 0) {
                    newBuf[newBuf.length - 1] &= (1 << numOverhang) - 1;
                }

                this._numOn = bitsOn(newBuf, size);
            } else {
                // we grew, no need to recompute num true, just copy
                newBuf.set(oldBuf);
            }
        } else {
            this._numOn = 0; // fresh array
        }
    }

    /**
     * Returns the buffer containing the bits on this bitset.
     * @return An array of integers.
     */
    get buffer(): ArrayBuffer {
        return this._buffer;
    }

    /**
     * Returns the number of bits set in the bitset.
     * @return The number of bits on in this bitset.
     */
    get numOn(): number {
        return this._numOn;
    }

    /**
     * Returns the number of bits unset in the bitset.
     * @return The number of bits off in this bitset.
     */
    get numOff(): number {
        return this.size - this.numOn;
    }
}

/**
 * Gets the respective index in the buffer for the i-th bit.
 * @param i The position of the bit.
 * @return The position of the element holding the bit in the buffer.
 */
function elementIndex(i: number) {
    return Math.floor(i / PER_ELEM_BITS);
}

/**
 * The place of the bit in its respective element.
 * @param i The position of the bit.
 * @return The bit position in the respective element for this.
 */
function bitPlace(i: number) {
    return i % PER_ELEM_BITS;
}

/**
 * The number of elements needed for a bitset of certain size.
 * @param size The number of bits required.
 * @return The number of elements required.
 */
function nElementsNeeded(size: number) {
    return Math.ceil(size / PER_ELEM_BITS);
}

/**
 * Counts the number of bits on in some buffer of certain size.
 * @param buf The buffer to check the bits on.
 * @param size The size of the buffer.
 * @return The number of bits on in buf.
 */
function bitsOn(buf: Uint32Array, size: number): number {
    const nElements = nElementsNeeded(size);
    const numOverhang = size % PER_ELEM_BITS;
    let sum = 0;

    for (let i = 0; i < nElements; i++) {
        if (i === nElements - 1 && numOverhang > 0) {
            sum += popCount(buf[i], numOverhang);
        } else {
            sum += popCount(buf[i]);
        }
    }

    return sum;
}

/**
 * Checks the number of bits on inside an integer from a bit position.
 * @param int The integer to check bits.
 * @param startingBit From where to check the bits.
 * @return The number of bits on in anInt.
 */
function popCount(int: number, startingBit?: number) {
    if (startingBit !== undefined) {
        int &= (1 << startingBit) - 1;
    }
    // Some boring constants
    int -= int >> 1 & 0x55555555;
    int = (int & 0x33333333) + (int >> 2 & 0x33333333);
    int = int + (int >> 4) & 0x0f0f0f0f;
    int += int >> 8;
    int += int >> 16;

    return int & 0x7f;
}

/**
 * Fills all elements in an array given with some value.
 * @param arr The array to fill.
 * @param value The value for every element in the array.
 * @param len The length of the array.
 */
function fill(arr: Uint32Array, value: number, len = arr.length): void {
    arr.fill(value, 0, len);
}
