export default abstract class Collection<T>{
    private _items: T[] = [];
    get items(){
        return this._items
    }
    set items(value){
        this._items = value;
    }

    private _name: string = "";
    get name(){
        return this._name;
    }
    set name(value){
        this._name = value;
    }

    get(index: number){
        this._items[index];
    }

    add(item: T){
        this._items.push(item);
    }

    delete(index: number){
        this._items.splice(index, 1);
    }

    pop(){
        this._items.pop();
    }
}