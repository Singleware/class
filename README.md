# Class

This package provides some decorators to ensure the class member visibility at runtime.

## How it works

When the JS run all decorators defined for your class will wrap the original methods to check its access rules, before pass the control back to the original method if the called method is private or protected, the wrapper goes check the context to determine if the current call is granted or not.

## Usage

```ts
import * as Class from '@singleware/class';

@Class.Describe()
class Example extends Class.Null {
  @Class.Private()
  private privateProperty = '';

  @Class.Protected()
  @Class.Property()
  protected protectedProperty = '';

  @Class.Public()
  @Class.Property()
  public publicProperty = '';

  @Class.Private()
  private privateMethod(): void {}

  @Class.Protected()
  protected protectedMethod(): void {}

  @Class.Public()
  public publicMethod(): void {}
}
```

### Decorators

| Name      | Description                                                                          |
| --------- | ------------------------------------------------------------------------------------ |
| Describe  | Wraps the decorated class to ensure its rules at runtime.                            |
| Private   | Makes the decorated member as private, visible only by its class.                    |
| Protected | Makes the decorated member as protected, visible on by its class and derived classes |
| Public    | Makes the decorated member as public, visible by every class.                        |
| Property  | Makes the decorates member as enumerable to use with loop statements like for...     |

### Methods

| Name    | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| perform | Performs the specified callback using the specified context rules. |
| resolve | Resolves the given wrapped context to the original context.        |

## Install

Using npm:

```sh
npm i @singleware/class
```

## License

[MIT &copy; Silas B. Domingos](https://balmante.eti.br)
