/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to implement the member visibility using the
 * class package.
 */
import * as Class from '../source';

/**
 * Example of basic class.
 */
@Class.Describe()
class Basic {
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
  @Class.Private()
  private privateCall(): void {
    console.log('PRIVATE CALL');
  }
  /**
   * Example of protected method.
   */
  @Class.Protected()
  protected protectedCall(): void {
    console.log('PROTECTED CALL');
  }
  /**
   * Example of public method.
   */
  @Class.Public()
  public publicCall(): void {
    console.log('PUBLIC CALL');
  }
}

/**
 * Construct the instance.
 */
const instance = new Basic();
