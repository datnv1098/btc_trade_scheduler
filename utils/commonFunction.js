function roundDownToFourDecimalPlaces(num = 0, decimalPlace = 4) {
  let floorNum = 1;
  for (let i = 1; i <= decimalPlace; i++) {
    floorNum = floorNum * 10;
  }
  return Math.floor(num * floorNum) / floorNum;
}

module.exports = {
  roundDownToFourDecimalPlaces
};