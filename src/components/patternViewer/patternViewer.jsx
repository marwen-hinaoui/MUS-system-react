function hpglToSVG(hpgl, scale = 0.02) {
  // const startString = "PU";
  // const endString = "PU;";

  // const startIndex = hpgl.indexOf(startString);
  // const endIndex = hpgl.lastIndexOf(endString);

  // const new_hpgl = hpgl.slice(0, startIndex) + hpgl.slice(endIndex + 1);
  // console.log(new_hpgl);
  const new_hpgl = parsePUsegments(hpgl);
  console.log(new_hpgl);
  const commands = new_hpgl.split(";");
  let pathData = "";
  let penDown = false;

  for (let cmd of commands) {
    cmd = cmd.trim();
    if (!cmd) continue;

    if (cmd.startsWith("PU")) {
      penDown = false;
      const coords = cmd.slice(2).split(",").map(Number);
      if (coords.length >= 2) {
        pathData += `M ${coords[0] * scale} ${coords[1] * scale} `;
      }
    } else if (cmd.startsWith("PD")) {
      penDown = true;
      const coords = cmd.slice(2).split(",").map(Number);
      for (let i = 0; i < coords.length; i += 2) {
        pathData += `L ${coords[i] * scale} ${coords[i + 1] * scale} `;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 900 900">
      <path d="${pathData}" stroke="black" fill="none" stroke-width="1"/>
    </svg>
  `;
}

export const HpglViewer = ({ hpglCode }) => {
  const svgString = hpglToSVG(hpglCode, 0.03);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgString }}
      style={{
        width: "100%",
        // height: "100vh",
      }}
    />
  );
};

function parsePUsegments(text) {
  if (typeof text !== "string") return "";
  const matches = text.match(/PU[\s\S]*?(?=PU|$)/g);
  return matches ? matches.join("") : "";
}
