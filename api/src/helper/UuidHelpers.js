const { v1: uuidv1 } = require('uuid');


const UUIDHelpers = {
  /**
   * generates UUID
   * 
   * @params
   * @returns uuid: String
   */
  generateUUID: () => {
    const uuid = uuidv1();
    return uuid;
  }
}

module.exports = UUIDHelpers