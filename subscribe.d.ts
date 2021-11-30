export declare type ConsoleEvent = {
    type: 'log' | 'info' | 'warn' | 'debug' | 'error';
    args: any[];
    loc: [string, string];
};
export declare type Listener = (event: ConsoleEvent) => void;
export default function subscribe(listener: Listener): void;
