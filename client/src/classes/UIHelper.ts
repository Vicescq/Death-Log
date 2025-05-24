export default class UIHelper{
    constructor(){};
    
    static sanitizeUserEntry(inputText: string): string{
        inputText = inputText.trim();
        if (inputText.includes("?")){
            throw new Error("No ?'s allowed!");
        }
        return inputText;
    }

    static createNodePath(inputText: string){
        inputText = UIHelper.sanitizeUserEntry(inputText);
        
    }
}