export default class ContextManager {
    // localStorage.setItem("x", JSON.stringify(games))

    reconstructCollection<T extends { _name: string, _items: any[] }, U>(serializedObj: T, classConstructor: new (...props: any[]) => U): U {
        const genericObj = Object.create(classConstructor.prototype);
        return Object.assign(genericObj, serializedObj);
    }
}