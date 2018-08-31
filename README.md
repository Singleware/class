# Class

This package provides some decorators to ensure the class member visibility at runtime.
I have this problem when I want to work with JavaScript and OOP patterns, so if that's your problem this package can help.

## Install

Using npm:

```sh
npm i @singleware/class
```

## Usage

#### Enforcing the access rules for member visibility.

```ts
import * as Class from '@singleware/class';

@Class.Describe()
class Example {
  @Class.Private()
  private privateMethod(): void {
    /* ... */
  }
  @Class.Protected()
  protected protectedMethod(): void {
    /* ... */
  }
  @Class.Public()
  public publicMethod(): void {
    /* ... */
  }
}
```

- **Private**, **Protected** and **Public** is used to manage the access rules for the each method based on its contexts.
- **Describe** is used to wrap the class type and constructor, and setup the external class context.

## How it works

When the JS runs, all decorators defined for your class will wrap the original methods to check its access rules before pass control back to the original method. So if some method is private or protected, the wrapper goes check its contexts to determine whether current call is granted or not. Public methods turns an external context into an internal context for subsequent calls (that can be another public, protected or private method).

## License

[MIT &copy; Silas B. Domingos](https://balmante.eti.br)
