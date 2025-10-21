function hpglToSVG(hpgl, scale = 0.02) {
  const startString = "SP1";
  const endString = "";

  const startIndex = hpgl.indexOf(startString);
  const endIndex = hpgl.lastIndexOf(endString);

  const new_hpgl = hpgl.slice(0, startIndex) + hpgl.slice(endIndex + 1);
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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 700 700">
      <path d="${pathData}" stroke="black" fill="none" stroke-width="1"/>
    </svg>
  `;
}

const HpglViewer = ({ hpglCode }) => {
  const svgString = hpglToSVG(hpglCode, 0.03);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgString }}
      style={{
        width: "700px",
        height: "100vh",
        border: "1px solid blue",
      }}
    />
  );
};

export const HpglViewerPage = () => {
  return (
    <div>
      <HpglViewer
        hpglCode={`IN;
                    IP0,0,1016,1016;
                    SC0,1000,0,1000;
                    SP1;DI1.000,0.000;SI1.083,1.625;LO5;PU10875,2115;LBL003260878NCPADPU10875,1155;LBL003748591AL0AB01
                    PU10255,1399;PD10255,1202,10648,1399,10254,1596,10255,1399,9501,1399,10255,1399,9501,1399,9498,1596,9104,1399,9498,1202,9498,1399;PU561,990;PD550,1069,483,1478,391,2043,338,2377,264,2847,255,2902,61,2871,30,3066,0,3260,194,3291,99,3887,232,3969,423,3960,432,4157,628,4148,825,4139,816,3942,829,3942,1027,3947,1301,3984,1571,4040,1847,4129,1993,4210,2127,4230,2444,3463,2531,3294,2628,3155,2702,3052,2801,2954,2909,2865,3078,2764,3212,2707,3392,2632,3565,2583,3844,2505,4023,2465,4245,2426,4780,2374,5282,2337,5551,2327,5558,2524,5754,2517,5951,2510,5944,2314,6466,2296,7629,2261,9682,2198,11341,2142,11864,2125,11870,2322,12067,2316,12264,2310,12258,2113,12289,2112,12933,2098,14328,2069,16505,2027,17606,2005,18757,1981,19796,1959,19800,2155,19997,2151,20193,2147,20189,1950,21241,1928,21391,1646,21565,1739,21658,1565,21750,1391,21576,1299,21687,1091,20495,1093,19304,1106,18736,1112,18222,1115,17729,1121,17151,1122,16246,1100,15766,1061,14752,961,13774,834,12877,693,11995,553,10872,376,9705,195,8867,85,8331,28,7910,6,7519,0,6195,1,5391,3,4744,5,4451,8,3922,17,3496,27,3175,36,2915,53,2553,104,2197,179,1937,261,1685,363,1434,491,1189,631,561,990;PU;
                    PU;`}
      />
    </div>
  );
};
