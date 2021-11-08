// @ts-nocheck
console.log("test string", 123);
console.info("test string", 123);
console.error("test string", 123);
console.warn("test string", 123);
console.debug("test string", 123);


console.test("test string", 123); // it shouldn't work here


function f(){}
f(console.log("test string", 123)); // prevent stack overflow


