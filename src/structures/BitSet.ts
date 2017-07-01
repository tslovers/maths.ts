/**
 * @licence
 * Copyright (C) 2017 Hector J. Vasquez <ipi.vasquez@gmail.com>
 *
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

// TODO: Document & edit
/**
 * A representation of a BitSet. It works as an array of booleans by handling the bits of the integers.
 * When the quantity of bits is greater than 32, it opens another position in the array.
 */
export class BitSet {
    private _buffer: Uint32Array;
    private _numOn: number = 0;
    private _size: number = 0;

    constructor(size: number = 1, buffer?: ArrayBuffer) {
        if (buffer)
            this.setFromBuffer(buffer, size);
        else
            this.setSize(size);
    }

    check(idx: number): boolean {
        return (this._buffer[elemIdx(idx)] & (1 << bitPlace(idx))) !== 0; // tslint:disable-line
    }

    get(idx: number): boolean {
        return (this._buffer[elemIdx(idx)] & (1 << bitPlace(idx))) !== 0; // tslint:disable-line
    }

    set(idx: number, val: boolean): void {
        const existing = this.check(idx);
        if (val === existing) return;
        if (val) {
            this._buffer[elemIdx(idx)] |= 1 << bitPlace(idx); // tslint:disable-line
        } else {
            this._buffer[elemIdx(idx)] &= ~(1 << bitPlace(idx)); // tslint:disable-line
        }
        this._numOn += val ? 1 : -1;
    }

    setAll(val: boolean): void {
        if (val) {
            // don't overfill the last element in case we grow (we'd be wrong)
            const numOverhang = this._size % PER_ELEM_BITS;
            if (numOverhang === 0) { // no overhang
                fill(this._buffer, FULL_ELEM);
            } else { // fill up to overhang, write last elem manually
                fill(this._buffer, FULL_ELEM, this._buffer.length - 1);
                this._buffer[this._buffer.length - 1] = (1 << numOverhang) - 1; // tslint:disable-line
            }
            this._numOn = this._size;
        } else {
            fill(this._buffer, 0);
            this._numOn = 0;
        }
    }

    numOn(): number {
        return this._numOn;
    }

    numOff(): number {
        return this.size() - this.numOn();
    }

    size(): number {
        return this._size;
    }

    any(): boolean {
        return this.numOn() > 0;
    }

    all(): boolean {
        return this.numOn() === this.size();
    }

    none(): boolean {
        return !this.any();
    }

    setSize(newSize: number) {
        if (newSize === this._size) return;
        this._size = newSize;
        const oldBuf = this._buffer;
        const newBuf = this._buffer = new Uint32Array(numElemsNeeded(newSize));
        if (oldBuf) {
            if (newBuf.length < oldBuf.length) {
                newBuf.set(oldBuf.subarray(0, newBuf.length));

                // clear any bits above the overhang
                const numOverhang = newSize % PER_ELEM_BITS;
                if (numOverhang > 0) {
                    newBuf[newBuf.length - 1] &= (1 << numOverhang) - 1; // tslint:disable-line
                }

                this._numOn = numOn(newBuf, newSize);
            } else {
                // we grew, no need to recompute num true, just copy
                newBuf.set(oldBuf);
            }
        } else {
            this._numOn = 0; // fresh array
        }
    }

    get buffer(): ArrayBuffer {
        return this._buffer.buffer;
    }

    setFromBuffer(buffer: ArrayBuffer, size: number) {
        this._buffer = new Uint32Array(buffer);
        this._size = size;
        this._numOn = numOn(this._buffer, size);
    }

    // TODO: clone? intersect, difference, union?

}

const PER_ELEM_BITS = 8 * Uint32Array.BYTES_PER_ELEMENT;
const FULL_ELEM = 0xFFFFFFFF;

function elemIdx(bitIdx: number) {
    return Math.floor(bitIdx / PER_ELEM_BITS);
}

function bitPlace(bitIdx: number) {
    return bitIdx % PER_ELEM_BITS;
}

function numElemsNeeded(size: number) {
    return Math.ceil(size / PER_ELEM_BITS);
}

function numOn(buf: Uint32Array, size: number): number {
    let sum = 0;
    const numElems = numElemsNeeded(size);
    const numOverhang = size % PER_ELEM_BITS;
    for (let i = 0; i < numElems; i++) {
        if (i === numElems - 1 && numOverhang > 0) {
            sum += popcount(buf[i], numOverhang);
        } else {
            sum += popcount(buf[i]);
        }
    }
    return sum;
}

function popcount(anInt: number, topBitPlaceToStart?: number) {
    if (topBitPlaceToStart !== undefined) {
        anInt &= (1 << topBitPlaceToStart) - 1 // tslint:disable-line
    }

    anInt -= anInt >> 1 & 0x55555555; // tslint:disable-line
    anInt = (anInt & 0x33333333) + (anInt >> 2 & 0x33333333); // tslint:disable-line
    anInt = anInt + (anInt >> 4) & 0x0f0f0f0f; // tslint:disable-line
    anInt += anInt >> 8; // tslint:disable-line
    anInt += anInt >> 16; // tslint:disable-line

    return anInt & 0x7f // tslint:disable-line
}

// world's jankiest polyfill
function fill(arr: Uint32Array, val: number, len = arr.length): void {
    if (arr.fill) {
        arr.fill(val, 0, len);
        return;
    }
    for (let i = 0; i < len; i++) {
        arr[i] = val;
    }
}