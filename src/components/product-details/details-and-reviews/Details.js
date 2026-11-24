import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Details = ({ description }) => {
  const theme = useTheme();
  // Render vendor-supplied text as React children. Using dangerouslySetInnerHTML
  // here allowed a seller to store executable markup in a product description.
  const lines = typeof description === "string" ? description.split(/\r?\n/) : [];

  return (
    <div>
      <div
        style={{
          color: theme.palette.neutral[400],
          fontSize: "12px",
        }}
      >
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {index > 0 && <br />}
            {line.match(/^\d+\./) && <br />}
            {line.trim() === "" ? <br /> : line}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

Details.propTypes = {};

export default Details;
