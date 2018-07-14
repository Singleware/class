# Class

This package provides some decorators to ensure the class member visibility at runtime.
I have this problem when I want to work with JavaScript and OOP patterns, so if that's your problem, this package can help.

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

- **Private**, **Protected** and **Public** is used to manage the access rules for the method based on the previous call. Also adds into the call stack its entry with the new context visibility for subsequent calls.
- **Describe** is used to wrap the class constructor and set into the call stack its entry with the context visibility to grant all access rules when the class is constructed calling internal methods.

#### Preserve current visibility for event based calls.

```ts
import * as Class from '@singleware/class';

@Class.Describe()
class Example {
  @Class.Public()
  public method(): void {
    this.subject.subscribe(
      Class.Helper.bind(() => {
        /* Preserved context and access rules... */
      })
    );
  }
}
```

- **bind** is used to wrap the specified callback to be called with the current access rules. So before executes the callback, the same visibility info of this call will be defined into the call stack to preserve the access rules.

#### Clear current visibility for external calls.

```ts
import * as Class from '@singleware/class';

@Class.Describe()
class Example {
  @Class.Public()
  public method(): void {
    Class.Helper.call(this.callback);
  }
}
```

- **call** is used to set the current visibility to null and call the given callback without any access rules. This method helps when you want to call an external method without share the current context visibility.

## How it works

When the JS runs, all defined decorators for your class can wraps the original methods to check the access rules before pass control back to the original methods. So if some method is private or protected, the wrapper goes check the previous call in the stack to determine whether current call is granted or not. Public methods just need to add its entry into the call stack for subsequent calls (that's can be another public, protected or private method).

## License

[MIT &copy; Silas B. Domingos](https://balmante.eti.br)
