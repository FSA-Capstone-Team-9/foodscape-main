import React from "react";
const legendComponent = {
  backgroundColor: "#fff",
  borderRadius: "3px",
  bottom: "30px",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  padding: "10px",
  position: "absolute",
  right: "10px",
  zIndex: 1,
};
const legendHeader = {
  margin: "0 0 10",
};
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
  console.log(typeof props.legendValue);
  switch (value) {
    case "1":
      return <VizOne />;
    case "2":
      return <VizTwo />;
    case "3":
      return <VizThree />;
    default:
      return <VizOne />;
  }
}
const VizOne = () => {
  console.log("VizOne");
  return (
    <div style={legendComponent}>
      <h4 style={legendHeader}>Legend</h4>
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
        4.0 - 4.5
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb9c34",
          })}
        ></span>
        3.5 - 4.0
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        3.0 - 3.5
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        3.0 or lower
      </div>
      <div>
        <span
          style={Object.assign({}, legendBigSpan, {
            backgroundColor: "#00ff00",
          })}
        ></span>
        Pricing
      </div>
    </div>
  );
};
const VizTwo = () => {
  console.log("VizTwo");
  return (
    <div style={legendComponent}>
      <h4 style={legendHeader}>Legend</h4>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#00ff00",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#e8eb34",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb9c34",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        4 or higher
      </div>
    </div>
  );
};
const VizThree = () => {
  console.log("VizThree");
  return (
    <div style={legendComponent}>
      <h4 style={legendHeader}>Legend</h4>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#00ff00",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#e8eb34",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb9c34",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        4 or higher
      </div>
      <div>
        <span
          style={Object.assign({}, legendSpan, {
            backgroundColor: "#eb3434",
          })}
        ></span>
        4 or higher
      </div>
    </div>
  );
};
