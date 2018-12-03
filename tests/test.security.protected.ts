/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * Test security of protected access outside of class.
 */
import * as Class from '../source';
import * as Tester from './helper';

// Tests
console.log('Security.Protected');

/**
 * Security scenario A
 */
Tester.exception(
  `Deny access to the protected method from public context.`,
  () => {
    @Class.Describe()
    class Test extends Class.Null {
      @Class.Protected()
      method(): void {}
    }

    new Test().method();
  },
  Class.Exception
);

/**
 * Security scenario B
 */
Tester.exception(
  `Deny access to the protected getter from public context.`,
  () => {
    @Class.Describe()
    class Test extends Class.Null {
      @Class.Protected()
      property = 10;
    }

    new Test().property;
  },
  Class.Exception
);

/**
 * Security scenario C
 */
Tester.exception(
  `Deny access to the protected setter from public context.`,
  () => {
    @Class.Describe()
    class Test extends Class.Null {
      @Class.Protected()
      property = 10;
    }

    new Test().property = 0;
  },
  Class.Exception
);
