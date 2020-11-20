import React from "react";
import "./FaceRecognition.css";
// import "./FaceRecognition.css";
const FaceRecognition = ({ imageURL, box }) => {
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
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            left: box.leftCol,
            bottom: box.bottomRow,
            right: box.rightCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
