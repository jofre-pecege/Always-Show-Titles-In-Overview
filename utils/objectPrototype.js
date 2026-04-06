export const ObjectPrototype = class ObjectPrototype {
    constructor() {
        this.injections = new Map();
    }

    injectOrOverrideFunction(objectPrototype, functionName, injected, targetFunction) {
        let originalFunction = objectPrototype[functionName];
    
        objectPrototype[functionName] = function() {
            let returnValue;
            if (injected && originalFunction !== undefined) {
                returnValue = originalFunction.apply(this, arguments);
            }
            let injectedReturnValue = targetFunction.apply(this, arguments);
            if (returnValue === undefined) {
                returnValue = injectedReturnValue;
            }
            return returnValue;
        }
    
        this.injections.set(objectPrototype.constructor.name+':'+functionName, originalFunction);
        return originalFunction;
    }

    removeInjections(objectPrototype) {
        for (let prototypeFunctionName of this.injections.keys()) {
            const functionNameArr = prototypeFunctionName.split(':');
            const objectPrototypeName = functionNameArr[0];
            if (objectPrototype.constructor.name !== objectPrototypeName) {
                continue;
            }

            const functionName = functionNameArr[1];
            if (!this.injections.has(prototypeFunctionName) || this.injections.get(prototypeFunctionName) === undefined) {
                delete objectPrototype[functionName];
            } else {
                objectPrototype[functionName] = this.injections.get(prototypeFunctionName);
            }
        }
    }
}
