export class InputError extends Error {
    constructor(message: string = 'There is something wrong with the input.') {
        super(message);
    }
}