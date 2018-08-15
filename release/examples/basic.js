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
 * Example of basic class.
 */
let Basic = class Basic {
    /**
     * Example of constructor.
     * Don't use decorators here.
     */
    constructor() {
        this.privateCall();
        this.protectedCall();
        this.publicCall();
    }
    /**
     * Example of private method.
     */
    privateCall() {
        console.log('PRIVATE CALL');
    }
    /**
     * Example of protected method.
     */
    protectedCall() {
        console.log('PROTECTED CALL');
    }
    /**
     * Example of public method.
     */
    publicCall() {
        console.log('PUBLIC CALL');
    }
};
__decorate([
    Class.Private()
], Basic.prototype, "privateCall", null);
__decorate([
    Class.Protected()
], Basic.prototype, "protectedCall", null);
__decorate([
    Class.Public()
], Basic.prototype, "publicCall", null);
Basic = __decorate([
    Class.Describe()
], Basic);
/**
 * Construct the instance.
 */
const instance = new Basic();
