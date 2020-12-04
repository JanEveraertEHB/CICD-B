
const ConversationhelpersImport = require('../helper/ConversationHelpers.js')

describe('check if helper senses emotion', () => {
  test('check on bad input', () => {
    expect(ConversationhelpersImport.senseEmotionHelper(null)).toBe(null);
    expect(ConversationhelpersImport.senseEmotionHelper(123)).toBe(null);
    expect(ConversationhelpersImport.senseEmotionHelper("")).toBe(null);
    expect(ConversationhelpersImport.senseEmotionHelper("a")).toBe(null);
  })
  test('check on no question', () => {
    expect(ConversationhelpersImport.senseEmotionHelper('hi there.')).toBe(1);
  })
  test('check if good comes through', () => {
    expect(ConversationhelpersImport.senseEmotionHelper("Don't you like this?")).toBe(2);
    expect(ConversationhelpersImport.senseEmotionHelper("Do you like this?")).toBe(2);
  })

  test('interpret emotion value', () => {
    expect(ConversationhelpersImport.convertEmotionValue(0)).toHaveProperty("emoji", ":|")
    expect(ConversationhelpersImport.convertEmotionValue(-1)).toHaveProperty("emoji", ":(")
    expect(ConversationhelpersImport.convertEmotionValue(1)).toHaveProperty("emoji", ":)")
  })
})