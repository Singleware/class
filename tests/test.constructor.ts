/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test access rules in object constructions.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Constructor');

/**
 * Test scenario A
 */
Tester.execute(`Call internals methods in object construction.`, () => {
  @Class.Describe()
  class Test {
    @Class.Public()
    public methodA(): void {
      this.methodD();
      this.methodE();
    }

    @Class.Private()
    private methodB(): void {
      this.methodD();
      this.methodE();
    }

    @Class.Protected()
    protected methodC(): void {
      this.methodD();
      this.methodE();
    }

    @Class.Private()
    private methodD(): void {}

    @Class.Protected()
    protected methodE(): void {}

    constructor() {
      this.methodA();
      this.methodB();
      this.methodC();
    }
  }

  new Test();
});

/**
 * Test scenario B
 */
Tester.execute(`Define own internal properties in object construction.`, () => {
  @Class.Describe()
  class Test {
    @Class.Private()
    private propertyA: number;

    @Class.Protected()
    protected propertyB: number;

    @Class.Public()
    public propertyC: number;

    constructor() {
      this.propertyA = 10;
      this.propertyB = 20;
      this.propertyC = 30;
    }

    @Class.Public()
    public get propertyD(): number {
      return this.propertyA + this.propertyB + this.propertyC;
    }
  }

  const instance = new Test();

  Tester.areEqual(instance.propertyC, 30);
  Tester.areEqual(instance.propertyD, 60);
});

/**
 * Test scenario C
 */
Tester.execute(`Call internal methods and properties during an inherited construction.`, () => {
  @Class.Describe()
  class Base {
    @Class.Private()
    private propertyA: number;

    @Class.Private()
    private methodA(): void {}

    constructor() {
      this.propertyA = 10;
      this.methodA();
    }
  }

  @Class.Describe()
  class Middle extends Base {
    @Class.Private()
    private propertyB: number;

    @Class.Private()
    private methodB(): void {}

    constructor() {
      super();
      this.propertyB = 20;
      this.methodB();
    }
  }

  @Class.Describe()
  class Derived extends Middle {
    @Class.Private()
    private propertyC: number;

    @Class.Private()
    private methodC(): void {}

    constructor() {
      super();
      this.propertyC = 30;
      this.methodC();
    }
  }

  new Derived();
});

/**
 * Test scenario D
 */
Tester.execute(`Method binding in object construction (bind the unwrapped 'this' and call after)`, () => {
  @Class.Describe()
  class Base {
    @Class.Public()
    public callbackA = this.methodA.bind(this);

    @Class.Public()
    public callbackB = this.methodB.bind(this);

    @Class.Private()
    private methodA() {}

    @Class.Protected()
    protected methodB() {}
  }

  @Class.Describe()
  class Test extends Base {
    @Class.Public()
    public callbackC = this.methodC.bind(this);

    @Class.Public()
    public callbackD = this.methodD.bind(this);

    @Class.Private()
    private methodC() {}

    @Class.Protected()
    protected methodD() {}
  }

  const instance = new Test();

  instance.callbackA();
  instance.callbackB();
  instance.callbackC();
  instance.callbackD();
});
