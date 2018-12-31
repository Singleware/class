/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to implement the enumerable member visibility
 * using the class package.
 */
import * as Class from '../source';

/**
 * Example of enumerable members.
 */
@Class.Describe()
class Basic extends Class.Null {
  @Class.Private()
  private privateProperty = '';

  @Class.Protected()
  @Class.Property()
  protected protectedProperty = '';

  @Class.Public()
  @Class.Property()
  public publicProperty = '';
}

const instance = new Basic();

for (const property in instance) {
  console.log(property);
}
