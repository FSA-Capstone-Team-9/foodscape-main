import React from "react";

const legendSpan = {
  borderRadius: "50%",
  display: "inline-block",
  height: "10px",
  marginRight: "5px",
  width: "10px",
};

const legendBigSpan = {
  borderRadius: "50%",
  display: "inline-block",
  height: "30px",
  marginRight: "5px",
  width: "30px",
  borderColor: "#000000",
  borderWidth: "thin",
};
export default function legend(props) {
  const value = props.legendValue;
  switch (value) {
    case "1":
      return <VizOne />;
    case "2":
      return <VizTwo />;
    case "3":
      return <VizThree />;
    default:
      return <VizThree />;
  }
}
const VizOne = () => {
  return (
    <div className="legendComponent">
      <h4 className="legendHeader">Legend</h4>
      <h5 className="legendHeader">Rating</h5>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#00ff00",
          })}
        ></span>
        4.5 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#e8eb34",
          })}
        ></span>
        4.0 - 4.4
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb9c34",
          })}
        ></span>
        3.5 - 3.9
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        3.4 or lower
      </div>
      <h5 className="legendHeader">Pricing</h5>
      <div>
        <span
          style={Object.assign({}, legendBigSpan, {
            backgroundColor: "#00ff00",
          })}
        ></span>
        Higher Price Point
      </div>
    </div>
  );
};
const VizTwo = () => {
  return (
    <div className="legendComponent">
      <h4 className="legendHeader">Legend</h4>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#00ff00",
          })}
        ></span>
        $
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#e8eb34",
          })}
        ></span>
        $$
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb9c34",
          })}
        ></span>
        $$$
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        $$$$
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#808080",
          })}
        ></span>
        Price point unknown
      </div>
    </div>
  );
};
const VizThree = () => {
  return (
    <div className="legendComponent">
      <h4 className="legendHeader">Legend</h4>
      <h5 className="legendHeader">Rating</h5>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#00ff00",
          })}
        ></span>
        4.5 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#e8eb34",
          })}
        ></span>
        4.0 - 4.4
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb9c34",
          })}
        ></span>
        3.5 - 3.9
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        3.4 or lower
      </div>
      <h5 className="legendHeader">Price Point</h5>$ - $$$$
    </div>
  );
};
