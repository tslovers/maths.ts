import {Real} from './';

export default class Parser {
    private readonly realPattern: RegExp = /\d+/;

    public static parseReal(n: string): Real {

        return new Real();
    }
}