/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test security of protected static access outside of class.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Security.Protected.Static');

/**
 * Security scenario A
 */
Tester.exception(
  `Deny access to the protected static method from public context.`,
  () => {
    @Class.Describe()
    class Test extends Class.Null {
      @Class.Protected()
      static method(): void {}
    }

    Test.method();
  },
  Class.Exception
);

/**
 * Security scenario B
 */
Tester.exception(
  `Deny access to the protected static getter from public context.`,
  () => {
    @Class.Describe()
    class Test extends Class.Null {
      @Class.Protected()
      static property = 10;
    }

    Test.property;
  },
  Class.Exception
);

/**
 * Security scenario C
 */
Tester.exception(
  `Deny access to the protected static setter from public context.`,
  () => {
    @Class.Describe()
    class Test extends Class.Null {
      @Class.Protected()
      static property = 10;
    }

    Test.property = 0;
  },
  Class.Exception
);
