/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules and calling order for static protected overrides in inheritance.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Protected.Override.Static');

/**
 * Test scenario A
 */
Tester.execute(`Override the protected static method from base class.`, () => {
  @Class.Describe()
  class Base extends Class.Null {
    @Class.Public()
    public static methodA(): void {
      this.methodB();
    }

    @Class.Protected()
    protected static methodB(): void {
      throw new Error(`Method does not overwritten.`);
    }
  }

  @Class.Describe()
  class TestA extends Base {
    @Class.Protected()
    protected static methodB(): void {}
  }

  TestA.methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Override the protected static method from base class and calls the base method by 'super' keyword.`, () => {
  @Class.Describe()
  class Base extends Class.Null {
    @Class.Protected()
    protected static methodA(): void {
      this.methodB();
    }

    @Class.Private()
    private static methodB(): void {}
  }

  @Class.Describe()
  class Test extends Base {
    @Class.Public()
    public static methodA(): void {
      super.methodA();
    }
  }

  Test.methodA();
});
