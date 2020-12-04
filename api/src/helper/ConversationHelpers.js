const _ = require('lodash');
const wordList = require('./wordList.js')


const Conversationhelpers = {

  /**
  * checks if do is there, returns :), if negative, returns :(
  * @params: questionInput: String - user given question
  * @returns: smiley 
  */
  senseEmotionHelper: (questionInput) => {
    if (typeof questionInput == "string" && questionInput.length > 1) {

      const questionLowerCase = questionInput.toLowerCase();
      questionLowerCase.replace("?", "");
      questionLowerCase.replace(".", "");
      questionLowerCase.replace("!", "");
      questionLowerCase.replace(":", "");
      const splittedWords = questionLowerCase.split(" ");
      let valueOfSentence = 1;
      for (const word in splittedWords) {
        const v = wordList[splittedWords[word]];
        if (v) valueOfSentence *= v;
      }
      return valueOfSentence;
    }
    return null
  },
  convertEmotionValue: (emotionInput) => {
    switch (Math.sign(emotionInput)) {
      case 0 || -0:
        return {
          emoji: ":|",
          emotion: "neutral",
          certainty: emotionInput
        }

        break;
      case -1:
        return {
          emoji: ":(",
          emotion: "sad",
          certainty: emotionInput
        }
      case 1:
        return {
          emoji: ":)",
          emotion: "happy",
          certainty: emotionInput
        }
    }
  }
}

module.exports = Conversationhelpers;