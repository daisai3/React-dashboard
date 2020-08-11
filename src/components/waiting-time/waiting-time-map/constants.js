const helpers = [
  {
    id: 0,
    label: 'Wait 2-5 minutes',
    name: 'wait-short',
    icon: 'singleEllipse',
  },
  {
    id: 1,
    label: 'Wait more than 5 minutes',
    name: 'wait-long',
    icon: 'singleEllipse',
  },
  { id: 2, label: 'New Customer', name: 'new-customer', icon: 'singleEllipse' },
];

const controls = [
  { id: 0, icon: 'move', type: 'move' },
  { id: 1, icon: 'zoomIn', type: 'zoom-in' },
  { id: 2, icon: 'zoomOut', type: 'zoom-out' },
  { id: 3, icon: 'seeAll', type: 'see-all' },
];

export { helpers, controls };
