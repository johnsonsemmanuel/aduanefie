
import React from "react";

const DollarSignHighlighter = ({ theme, text }) => {

  return (
    <>
      {text &&
        text.split(/\s+/).map((part, index) => {
          // Check if the word contains at least one dollar sign
          const isMatch = part.includes("$");

          const normalizedPart = part.replaceAll("$", "");
          return (
            <span
              key={index}
              style={{
                color: isMatch ? theme.palette.primary.main : "inherit",
                textAlign: "left"
              }}
            >
              {index !== 0 && " "}
              {normalizedPart}
            </span>
          );
        })}
    </>
  );
};

export default DollarSignHighlighter;
