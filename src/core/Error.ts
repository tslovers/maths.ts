export class InputError extends Error {
    constructor(message: string = 'There is something wrong with the input.') {
        super(message);
    }
}

export class DuplicatedKeyError extends Error {
    constructor(m: string = 'You are trying to add an already existing key.') {
        super(m);
    }
}