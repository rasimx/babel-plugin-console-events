import * as path from "path";
import { transformFileSync } from '@babel/core';
import subscribe, { ConsoleEvent } from "../src/subscribe";
import plugin from '../src/plugin'

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

it('plugin', () => {
  expect(transformFileSync(path.join(__dirname, 'fixtures/plugin.ts'), {plugins: [plugin]})!.code).toMatchSnapshot()
})

it("macros", () => {
  expect(transformFileSync(path.join(__dirname, 'fixtures/macro.ts'))!.code).toMatchSnapshot()
})