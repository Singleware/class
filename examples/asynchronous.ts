/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to implement the member visibility using the
 * class package.
 */
import * as Class from '../source';

/**
 * Example of asynchronous method.
 */
async function print(text: string): Promise<void> {
  console.log(text);
}

/**
 * Example of asynchronous class.
 */
@Class.Describe()
class AsyncA extends Class.Null {
  /**
   * Example of private method.
   * @param interval Method interval.
   */
  @Class.Private()
  private privateCall(interval: number): Promise<void> {
    return new Promise<void>((resolve: any, reject: any) => {
      setTimeout(() => {
        print(`A: PRIVATE CALL '${interval}'`);
        resolve();
      }, interval);
    });
  }
  /**
   * Example of protected method.
   */
  @Class.Protected()
  protected async protectedCall(): Promise<void> {
    console.log(`A: PROTECTED CALL`);
    for (let i = 0; i < 3; ++i) {
      await this.privateCall(1000);
    }
    this.privateCall(500);
  }
  /**
   * Example of public method.
   */
  @Class.Public()
  public async publicCall(): Promise<void> {
    console.log(`A: PUBLIC CALL`);
    await this.protectedCall();
  }
}

/**
 * Example of asynchronous concurrent class.
 */
@Class.Describe()
class AsyncB extends Class.Null {
  /**
   * Example of private method.
   * @param interval Method interval.
   */
  @Class.Private()
  private privateCall(interval: number): Promise<void> {
    return new Promise<void>((resolve: any, reject: any) => {
      setTimeout(() => {
        console.log(`B: PRIVATE CALL '${interval}'`);
        resolve();
      }, interval);
    });
  }
  /**
   * Example of protected method.
   */
  @Class.Protected()
  protected async protectedCall(): Promise<void> {
    console.log(`B: PROTECTED CALL`);
    for (let i = 0; i < 2; ++i) {
      await this.privateCall(1000);
    }
    this.privateCall(500);
  }
  /**
   * Example of public method.
   */
  @Class.Public()
  public async publicCall(): Promise<void> {
    console.log(`B: PUBLIC CALL`);
    await this.protectedCall();
  }
}

/**
 * Construct the instance.
 */
const instanceA = new AsyncA();
const instanceB = new AsyncB();

instanceA.publicCall();
instanceB.publicCall();
