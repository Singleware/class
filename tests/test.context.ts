/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test preservation of context access rules in static calls.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Context');

/**
 * Test scenario A
 */
Tester.execute(`Call internal methods from callback context.`, () => {
  @Class.Describe()
  class Test extends Class.Null {
    @Class.Public()
    public methodA(): Function {
      return () => {
        this.methodC();
        this.methodD();
      };
    }

    @Class.Public()
    public methodB(): Function {
      return function(this: Test) {
        this.methodC();
        this.methodD();
      }.bind(this);
    }

    @Class.Private()
    private methodC(): void {}

    @Class.Protected()
    protected methodD(): void {}
  }

  new Test().methodA()();
  new Test().methodB()();
});

/**
 * Test scenario B
 */
Tester.execute(`Call internal methods from another instance of same type.`, () => {
  @Class.Describe()
  class Test extends Class.Null {
    @Class.Private()
    private static methodAA(): void {}

    @Class.Protected()
    protected static methodAB(): void {}

    @Class.Private()
    private methodBA(): void {}

    @Class.Protected()
    protected methodBB(): void {}

    @Class.Protected()
    protected static methodBC(other: Test): void {
      other.methodBA();
      other.methodBB();
    }

    @Class.Public()
    public static methodA(other: typeof Test): void {
      other.methodAA();
      other.methodAB();
    }

    @Class.Public()
    public static methodB(other: Test): void {
      other.methodBA();
      other.methodBB();
      this.methodBC(other);
    }
  }

  Test.methodA(Test);
  Test.methodB(new Test());
});
