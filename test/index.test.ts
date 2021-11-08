import pluginTester from 'babel-plugin-tester'
import plugin, { ConsoleEvent, subscribe } from '../src'
import * as path from "path";

pluginTester({
    plugin: plugin,
    title: 'console-events',
    fixtures: path.join(__dirname, '__fixtures__'),
})

describe('subscribe', () => {
    it('called with the passed arguments', () => {
        const listenerStub = jest.fn()
        subscribe(listenerStub)

        const event: ConsoleEvent = {
            type: "warn",
            args: ["test string", 123],
            loc: ["code.ts", "5"],
        }

        //@ts-ignore
        console.events.emit(event);
        expect(listenerStub).toHaveBeenCalledWith(event);
    })
})
