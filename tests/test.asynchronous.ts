/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test preservation of access rules in asynchronous calls.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Asynchronous');

async function external(): Promise<void> {
  return new Promise((resolve: Class.Callable, reject: Class.Callable) => {
    setTimeout(() => resolve(), 500);
  });
}

/**
 * Test scenario A
 */
Tester.execute(`Call internal methods by 'this' keyword between chained promises.`, async () => {
  @Class.Describe()
  class Base {
    @Class.Protected()
    protected methodB(): void {}
  }

  @Class.Describe()
  class TestA extends Base {
    @Class.Public()
    public async methodA(): Promise<void> {
      await external();

      this.methodB();

      external().then(() => {
        this.methodC();
      });
    }

    @Class.Private()
    private methodC(): void {}
  }

  await new TestA().methodA();
});

/**
 * Test scenario B
 */
Tester.execute(`Call inherited methods by 'super' keyword between chained promises.`, async () => {
  @Class.Describe()
  class Base {
    @Class.Protected()
    protected methodB(): void {}

    @Class.Protected()
    protected methodC(): void {}
  }

  @Class.Describe()
  class TestB extends Base {
    @Class.Public()
    public async methodA(): Promise<void> {
      await external();

      // To access internal methods from another object with same type.
      await Class.perform(this, async () => {
        super.methodB();

        await external();

        await Class.perform(this, async () => {
          super.methodC();
        });
      });
    }
  }

  await new TestB().methodA();
});

/**
 * Test scenario C
 */
Tester.execute(`Call internal methods from another instance of same type between chained promises.`, async () => {
  @Class.Describe()
  class TestC {
    @Class.Public()
    public async methodA(other: TestC): Promise<void> {
      other.methodB();
      other.methodC();
      await external();

      // To access internal methods from another object with same type.
      await Class.perform(this, async () => {
        other.methodB();

        await external();

        await Class.perform(this, async () => {
          other.methodC();
        });
      });
    }

    @Class.Private()
    private methodB(): void {}

    @Class.Protected()
    protected methodC(): void {}
  }

  await new TestC().methodA(new TestC());
});
