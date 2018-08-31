/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules and calling order in static inheritance.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Inheritance.Static');

/**
 * Test scenario A
 */
Tester.execute(`Call overridden static methods from base to derived and goes to base again.`, () => {
  @Class.Describe()
  class Base {
    @Class.Public()
    public static methodA(): void {
      this.methodB();
    }

    @Class.Protected()
    protected static methodB(): void {
      throw new Error(`Method does not overwritten.`);
    }

    @Class.Protected()
    protected static methodE(): void {}
  }

  @Class.Describe()
  class Middle extends Base {
    @Class.Protected()
    protected static methodB(): void {
      this.methodC();
    }

    @Class.Protected()
    protected static methodC(): void {
      throw new Error(`Method does not overwritten.`);
    }

    @Class.Protected()
    protected static methodD(): void {
      this.methodE();
    }
  }

  @Class.Describe()
  class Derived extends Middle {
    @Class.Protected()
    protected static methodC(): void {
      super.methodD();
    }
  }

  Derived.methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Access inherited static public and static protected properties.`, () => {
  @Class.Describe()
  class Base {
    @Class.Protected()
    protected static propertyA = 10;
    @Class.Public()
    public static baseValue = 1;
  }

  @Class.Describe()
  class Middle extends Base {
    @Class.Protected()
    protected static propertyB = 20;
    @Class.Public()
    public static middleValue = 2;
  }

  @Class.Describe()
  class Derived extends Middle {
    @Class.Public()
    public static get derivedValue(): number {
      return this.propertyA + this.propertyB;
    }
  }

  Tester.areEqual(Derived.baseValue, 1);
  Tester.areEqual(Derived.middleValue, 2);
  Tester.areEqual(Derived.derivedValue, 30);
});

/**
 * Test scenario C
 */
Tester.execute(`Access inherited method that call private static methods and properties.`, () => {
  @Class.Describe()
  class Base {
    @Class.Private()
    private static methodB(): void {}

    @Class.Private()
    private static propertyC?: number;

    @Class.Public()
    public static methodA(): void {
      this.methodB();
      this.propertyC = 10;
    }
  }

  @Class.Describe()
  class Derived extends Base {}

  Derived.methodA();
});
