import React from "react";
import "./FaceRecognition.css";
// import "./FaceRecognition.css";
const FaceRecognition = ({ imageURL, boxes }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2 ma">
        <img
          id="inputImage"
          alt=""
          src={imageURL}
          width="500px"
          height="auto"
        ></img>
        {boxes.map((box) => {
          return (
            <div
              className="bounding-box"
              key={box.topRow} // Key for identification (unique)
              style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
