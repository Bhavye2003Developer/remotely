const getHypotenuse = (x1, y1, canvasCenterCoord) => {
  console.log("in geo: ", canvasCenterCoord);
  return Math.sqrt(
    Math.pow(x1 - canvasCenterCoord.current[0], 2) +
      Math.pow(y1 - canvasCenterCoord.current[1], 2)
  );
};

export { getHypotenuse };
