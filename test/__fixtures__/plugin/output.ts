// @ts-nocheck
console.log("test string", 123);

if (console.events) {
  console.events.emit({
    type: "log",
    args: ["test string", 123],
    loc: ["code.ts", "2"],
  });
}

console.info("test string", 123);

if (console.events) {
  console.events.emit({
    type: "info",
    args: ["test string", 123],
    loc: ["code.ts", "3"],
  });
}

console.error("test string", 123);

if (console.events) {
  console.events.emit({
    type: "error",
    args: ["test string", 123],
    loc: ["code.ts", "4"],
  });
}

console.warn("test string", 123);

if (console.events) {
  console.events.emit({
    type: "warn",
    args: ["test string", 123],
    loc: ["code.ts", "5"],
  });
}

console.debug("test string", 123);

if (console.events) {
  console.events.emit({
    type: "debug",
    args: ["test string", 123],
    loc: ["code.ts", "6"],
  });
}

console.test("test string", 123); // it shouldn't work here

function f() {}

f(console.log("test string", 123)); // prevent stack overflow