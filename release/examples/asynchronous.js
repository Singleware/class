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
 * The proposal of this example is to show how to implement the member visibility using the
 * class package.
 */
const Class = require("../source");
/**
 * Example of asynchronous method.
 */
async function print(text) {
    console.log(text);
}
/**
 * Example of asynchronous class.
 */
let AsyncA = class AsyncA {
    /**
     * Example of private method.
     * @param interval Method interval.
     */
    privateCall(interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                print(`A: PRIVATE CALL '${interval}'`);
                resolve();
            }, interval);
        });
    }
    /**
     * Example of protected method.
     */
    async protectedCall() {
        console.log(`A: PROTECTED CALL`);
        for (let i = 0; i < 3; ++i) {
            await this.privateCall(1000);
        }
        this.privateCall(500);
    }
    /**
     * Example of public method.
     */
    async publicCall() {
        console.log(`A: PUBLIC CALL`);
        await this.protectedCall();
    }
};
__decorate([
    Class.Private()
], AsyncA.prototype, "privateCall", null);
__decorate([
    Class.Protected()
], AsyncA.prototype, "protectedCall", null);
__decorate([
    Class.Public()
], AsyncA.prototype, "publicCall", null);
AsyncA = __decorate([
    Class.Describe()
], AsyncA);
/**
 * Example of asynchronous concurrent class.
 */
let AsyncB = class AsyncB {
    /**
     * Example of private method.
     * @param interval Method interval.
     */
    privateCall(interval) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`B: PRIVATE CALL '${interval}'`);
                resolve();
            }, interval);
        });
    }
    /**
     * Example of protected method.
     */
    async protectedCall() {
        console.log(`B: PROTECTED CALL`);
        for (let i = 0; i < 2; ++i) {
            await this.privateCall(1000);
        }
        this.privateCall(500);
    }
    /**
     * Example of public method.
     */
    async publicCall() {
        console.log(`B: PUBLIC CALL`);
        await this.protectedCall();
    }
};
__decorate([
    Class.Private()
], AsyncB.prototype, "privateCall", null);
__decorate([
    Class.Protected()
], AsyncB.prototype, "protectedCall", null);
__decorate([
    Class.Public()
], AsyncB.prototype, "publicCall", null);
AsyncB = __decorate([
    Class.Describe()
], AsyncB);
/**
 * Construct the instance.
 */
const instanceA = new AsyncA();
const instanceB = new AsyncB();
instanceA.publicCall();
instanceB.publicCall();
