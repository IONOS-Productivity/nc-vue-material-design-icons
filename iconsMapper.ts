import * as mdiIcons from '@mdi/js/commonjs/mdi.js';

// MDI viewBox is always 24x24
const mdiViewBox = {
  width: 24,
  height: 24,
};

const remap = reMapIcons();

function reMapIcons() {
  const result = {
    icons: { ...mdiIcons },
    viewBoxes: {},
  };

  for (const icon in result.icons) {
    // add the viewBox for the icon in order to build the template correctly
    result.viewBoxes[icon] = mdiViewBox;
  }

  return result;
}

export default {
  getIcons() {
    return remap;
  },
};
