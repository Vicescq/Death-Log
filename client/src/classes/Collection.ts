export default abstract class Collection<T>{
    private _collection: T[] = [];
    get collection(){
        return this._collection
    }
    set collection(value){
        this._collection = value;
    }

    private _name: string = "";
    get name(){
        return this._name;
    }
    set name(value){
        this._name = value;
    }

    get(index: number){
        this._collection[index];
    }

    add(item: T){
        this._collection.push(item);
    }

    delete(index: number){
        this._collection.splice(index, 1);
    }

    pop(){
        this._collection.pop();
    }
}