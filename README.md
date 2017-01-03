# Observu
Very simple library to observe for changes in JavaScript object. Observu utilizes es2015 proxy feature to detect any change in Object. For browsers which do not support Proxy, Observu will dirty-check Object to identify change.

### How to use

- Install using npm
```
    npm install observu
```
- Import in your project
```
    import Observu from "observu";
```
- Create object which can be observed
```
    var person = Observu({
        name: {
            firstName: "John",
            lastName: "Doe"
        },
        age: 29
    })
    
    // To listen for change
    person.onChange = function (updatedObject, targetObject, keyName, valueSet) {
        // Your change listener functionality
    }
```

Alternatively, you can also include script file in your html as:
```
    <script src="//unpkg.com/observu/dist/observu.min.js"></script>
```
This will add Observu over the global context. Which can be ued as
```
    var person = Observu.default({
        name: {
            firstName: "John",
            lastName: "Doe"
        },
        age: 29
    })
    
    // To listen for change
    person.onChange = function (updatedObject, targetObject, keyName, valueSet) {
        // Your change listener functionality
    }
```
