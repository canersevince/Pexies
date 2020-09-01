import { Injectable } from '@nestjs/common';
const badWordFilter = require('bad-words')
var filter = new badWordFilter({ regex: /\*|\.|$/gi });
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}
@Injectable()
export class FilterService {
    clearWord(word){
        let wordArray;
        let cleanWordArray = []
        let clearWord;
        if(word.includes(' ')){
            wordArray = word.split(' ')
            wordArray.forEach(w => {
                if(w) {
                    cleanWordArray.push(filter.clean(w))
                }
            })
        }
        if(cleanWordArray.length>0){
            clearWord = cleanWordArray.join(' ')
        } else {
            clearWord = filter.clean(word)
        }
        clearWord = replaceAll(clearWord, '*', '')
        return clearWord
    }
}
