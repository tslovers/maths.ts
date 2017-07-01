import * as graphs from './graphs';

export {
    graphs
}

/**
 * The formal definition of the algorithms logger.
 */
export type Logger = {
    stepName: string;
    stepInfo?: any;
}[];