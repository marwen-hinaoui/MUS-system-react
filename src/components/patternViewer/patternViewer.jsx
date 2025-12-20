function hpglToSVG(hpgl, scale = 0.02) {
  const new_hpgl = parsePUsegments(hpgl);
  const commands = new_hpgl.split(";");

  let pathData = "";
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  // Helper to track bounding box
  const updateBounds = (x, y) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  for (let cmd of commands) {
    cmd = cmd.trim();
    if (!cmd) continue;

    if (cmd.startsWith("PU")) {
      const coords = cmd.slice(2).split(",").map(Number);
      if (coords.length >= 2) {
        const x = coords[0] * scale;
        const y = coords[1] * scale;
        pathData += `M ${x} ${y} `;
        updateBounds(x, y);
      }
    } else if (cmd.startsWith("PD")) {
      const coords = cmd.slice(2).split(",").map(Number);
      for (let i = 0; i < coords.length; i += 2) {
        const x = coords[i] * scale;
        const y = coords[i + 1] * scale;
        pathData += `L ${x} ${y} `;
        updateBounds(x, y);
      }
    }
  }

  // Calculate width/height and add a small padding for the stroke
  const width = maxX - minX;
  const height = maxY - minY;
  const padding = 2; // Adjust based on your stroke-width

  // Final viewBox: "minX minY width height"
  return `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="${width + padding * 2}" 
         height="${height + padding * 2}" 
         viewBox="${minX - padding} ${minY - padding} ${width + padding * 2} ${
    height + padding * 2
  }" 
         data--h-bstatus="0OBSERVED">
      <path d="${pathData.trim()}" stroke="black" fill="none" stroke-width="1"/>
    </svg>
  `;
}

export const HpglViewer = ({ hpglCode, scale }) => {
  const svgString = hpglToSVG(hpglCode, scale || 0.005);

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
