export type ConsoleEvent = {
  type: 'log' | 'info' | 'warn' | 'debug' | 'error',
  args: any[],
  loc: [string, string]
}

export type Listener = (event: ConsoleEvent) => void

class EventEmitter {
  private listeners: Listener[]
  constructor() {
    this.listeners = [];
  }

  emit(event: ConsoleEvent): void {
    this.listeners.forEach((listener) => {
      listener(event)
    })
  }

  subscribe(listener: Listener): Listener {
    this.listeners.push(listener)
    return listener
  }
}

export function subscribe(listener: Listener): void{
  //@ts-ignore
  console.events = console.events ?? new EventEmitter();
  //@ts-ignore
  console.events.subscribe(listener)
}


