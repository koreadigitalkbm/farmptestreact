

module.exports = class KDCommon {
  static getFoodJukebox_Productid() {
    return 0xfc21;
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

};
