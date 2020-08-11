const controls = [
  { id: 0, icon: 'move', type: 'move' },
  { id: 1, icon: 'zoomIn', type: 'zoom-in' },
  { id: 2, icon: 'zoomOut', type: 'zoom-out' },
  { id: 3, icon: 'seeAll', type: 'see-all' },
];

const coordsData = {
  max: 6,
  values: [
    {
      value: 2,
      x: 1385,
      y: 3785,
    },
    {
      value: 1,
      x: 1385,
      y: 3825,
    },
    {
      value: 1,
      x: 1385,
      y: 3925,
    },
    {
      value: 2,
      x: 1385,
      y: 3945,
    },
    {
      value: 1,
      x: 1385,
      y: 3965,
    },
    {
      value: 1,
      x: 1395,
      y: 3775,
    },
    {
      value: 1,
      x: 1395,
      y: 3835,
    },
    {
      value: 1,
      x: 1395,
      y: 3885,
    },
    {
      value: 1,
      x: 1395,
      y: 3895,
    },
    {
      value: 3,
      x: 1395,
      y: 3905,
    },
    {
      value: 1,
      x: 1395,
      y: 3925,
    },
    {
      value: 1,
      x: 1405,
      y: 3685,
    },
    {
      value: 2,
      x: 1405,
      y: 3705,
    },
    {
      value: 3,
      x: 1405,
      y: 3735,
    },
    {
      value: 1,
      x: 1405,
      y: 3745,
    },
    {
      value: 1,
      x: 1405,
      y: 3785,
    },
    {
      value: 1,
      x: 1405,
      y: 3855,
    },
    {
      value: 1,
      x: 1405,
      y: 3925,
    },
    {
      value: 1,
      x: 1405,
      y: 3935,
    },
    {
      value: 1,
      x: 1415,
      y: 3675,
    },
    {
      value: 2,
      x: 1415,
      y: 3725,
    },
    {
      value: 1,
      x: 1415,
      y: 3735,
    },
    {
      value: 1,
      x: 1415,
      y: 3765,
    },
    {
      value: 3,
      x: 1415,
      y: 3895,
    },
    {
      value: 3,
      x: 1425,
      y: 3635,
    },
    {
      value: 1,
      x: 1425,
      y: 3665,
    },
    {
      value: 1,
      x: 1425,
      y: 3745,
    },
    {
      value: 6,
      x: 1425,
      y: 3765,
    },
    {
      value: 1,
      x: 1425,
      y: 3775,
    },
    {
      value: 1,
      x: 1425,
      y: 3805,
    },
    {
      value: 2,
      x: 1425,
      y: 3845,
    },
    {
      value: 2,
      x: 1445,
      y: 3645,
    },
    {
      value: 1,
      x: 1455,
      y: 3635,
    },
    {
      value: 2,
      x: 1455,
      y: 3695,
    },
    {
      value: 1,
      x: 1465,
      y: 3615,
    },
    {
      value: 2,
      x: 1465,
      y: 3665,
    },
    {
      value: 2,
      x: 1465,
      y: 3685,
    },
    {
      value: 1,
      x: 1475,
      y: 3575,
    },
    {
      value: 1,
      x: 1475,
      y: 3655,
    },
    {
      value: 1,
      x: 1485,
      y: 3515,
    },
    {
      value: 1,
      x: 1485,
      y: 3555,
    },
    {
      value: 3,
      x: 1495,
      y: 3615,
    },
    {
      value: 2,
      x: 1495,
      y: 3725,
    },
    {
      value: 1,
      x: 1515,
      y: 3575,
    },
    {
      value: 2,
      x: 1525,
      y: 3425,
    },
    {
      value: 1,
      x: 1535,
      y: 3435,
    },
    {
      value: 1,
      x: 1545,
      y: 3465,
    },
    {
      value: 2,
      x: 1575,
      y: 3425,
    },
    {
      value: 1,
      x: 1585,
      y: 3465,
    },
    {
      value: 2,
      x: 1625,
      y: 3435,
    },
    {
      value: 3,
      x: 1625,
      y: 3445,
    },
    {
      value: 1,
      x: 1645,
      y: 3445,
    },
    {
      value: 1,
      x: 1665,
      y: 3425,
    },
    {
      value: 1,
      x: 1685,
      y: 3445,
    },
    {
      value: 1,
      x: 1705,
      y: 3445,
    },
    {
      value: 1,
      x: 1715,
      y: 3415,
    },
    {
      value: 2,
      x: 1735,
      y: 3395,
    },
    {
      value: 3,
      x: 1755,
      y: 3405,
    },
    {
      value: 1,
      x: 1775,
      y: 3405,
    },
    {
      value: 1,
      x: 1785,
      y: 3415,
    },
    {
      value: 1,
      x: 1795,
      y: 3395,
    },
    {
      value: 1,
      x: 1825,
      y: 3405,
    },
    {
      value: 3,
      x: 1835,
      y: 3325,
    },
    {
      value: 1,
      x: 1835,
      y: 3405,
    },
    {
      value: 1,
      x: 1895,
      y: 3345,
    },
    {
      value: 1,
      x: 1915,
      y: 3345,
    },
    {
      value: 1,
      x: 1925,
      y: 3335,
    },
    {
      value: 1,
      x: 2085,
      y: 1535,
    },
    {
      value: 1,
      x: 2105,
      y: 1535,
    },
    {
      value: 3,
      x: 2125,
      y: 1505,
    },
    {
      value: 1,
      x: 2125,
      y: 1515,
    },
    {
      value: 2,
      x: 2145,
      y: 1475,
    },
    {
      value: 1,
      x: 2155,
      y: 1475,
    },
    {
      value: 1,
      x: 2175,
      y: 1465,
    },
    {
      value: 1,
      x: 2175,
      y: 1475,
    },
    {
      value: 1,
      x: 2205,
      y: 1445,
    },
    {
      value: 1,
      x: 2225,
      y: 1415,
    },
    {
      value: 1,
      x: 2245,
      y: 1455,
    },
    {
      value: 2,
      x: 2255,
      y: 1395,
    },
    {
      value: 3,
      x: 2255,
      y: 1415,
    },
    {
      value: 1,
      x: 2265,
      y: 1415,
    },
    {
      value: 1,
      x: 2275,
      y: 1405,
    },
    {
      value: 2,
      x: 2285,
      y: 1395,
    },
  ],
};

export { controls, coordsData };
