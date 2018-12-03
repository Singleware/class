/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules for static public calls.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Public.Static');

/**
 * Test scenario A
 */
Tester.execute(`Call a public method.`, () => {
  @Class.Describe()
  class Test extends Class.Null {
    @Class.Public()
    public static methodA(): void {
      this.methodD();
      this.methodE();
    }

    @Class.Private()
    private static methodD(): void {}

    @Class.Protected()
    protected static methodE(): void {}
  }

  Test.methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Access public properties.`, () => {
  @Class.Describe()
  class Test extends Class.Null {
    @Class.Public()
    public static propertyA = 10;

    @Class.Public()
    public static get propertyB(): number {
      return this.propertyA + 10;
    }

    @Class.Public()
    public static set propertyC(value: number) {
      this.propertyA = value;
    }
  }

  Test.propertyC = 20;
  Tester.areEqual(Test.propertyA, 20);
  Tester.areEqual(Test.propertyB, 30);

  Test.propertyA = 5;
  Tester.areEqual(Test.propertyA, 5);
});
