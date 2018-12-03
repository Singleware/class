"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test preservation of access rules in asynchronous calls.
 */
const Class = require("../source");
const Tester = require("./helper");
// Tests
console.log('Asynchronous');
async function external() {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 500);
    });
}
/**
 * Test scenario A
 */
Tester.execute(`Call internal methods by 'this' keyword between chained promises.`, async () => {
    let Base = class Base extends Class.Null {
        methodB() { }
    };
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodB", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let TestA = class TestA extends Base {
        async methodA() {
            await external();
            this.methodB();
            external().then(() => {
                this.methodC();
            });
        }
        methodC() { }
    };
    __decorate([
        Class.Public()
    ], TestA.prototype, "methodA", null);
    __decorate([
        Class.Private()
    ], TestA.prototype, "methodC", null);
    TestA = __decorate([
        Class.Describe()
    ], TestA);
    await new TestA().methodA();
});
/**
 * Test scenario B
 */
Tester.execute(`Call inherited methods by 'super' keyword between chained promises.`, async () => {
    let Base = class Base extends Class.Null {
        methodB() { }
        methodC() { }
    };
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodB", null);
    __decorate([
        Class.Protected()
    ], Base.prototype, "methodC", null);
    Base = __decorate([
        Class.Describe()
    ], Base);
    let TestB = class TestB extends Base {
        async methodA() {
            await external();
            // To access internal methods from another object with same type.
            await Class.perform(this, async () => {
                super.methodB();
                await external();
                await Class.perform(this, async () => super.methodC());
            });
        }
    };
    __decorate([
        Class.Public()
    ], TestB.prototype, "methodA", null);
    TestB = __decorate([
        Class.Describe()
    ], TestB);
    await new TestB().methodA();
});
/**
 * Test scenario C
 */
Tester.execute(`Call internal methods from another instance of same type between chained promises.`, async () => {
    let TestC = class TestC {
        async methodA(other) {
            other.methodB();
            other.methodC();
            await external();
            // To access internal methods from another object with same type.
            await Class.perform(this, async () => {
                other.methodB();
                await external();
                await Class.perform(this, async () => other.methodC());
            });
        }
        methodB() { }
        methodC() { }
    };
    __decorate([
        Class.Public()
    ], TestC.prototype, "methodA", null);
    __decorate([
        Class.Private()
    ], TestC.prototype, "methodB", null);
    __decorate([
        Class.Protected()
    ], TestC.prototype, "methodC", null);
    TestC = __decorate([
        Class.Describe()
    ], TestC);
    await new TestC().methodA(new TestC());
});
