import * as mdiIcons from '@mdi/js/commonjs/mdi.js';

// MDI viewBox is always 24x24
const mdiViewBox: DOMRectInit = {
  x: 0,
  y: 0,
  width: 24,
  height: 24,
};

type SvgPathData = string;
type MappingResult = {
  icons: { [key: string]: SvgPathData };
  viewBoxes: { [key: string]: DOMRectInit };
};

const remap = reMapIcons();

function reMapIcons(): MappingResult {
  const result: MappingResult = {
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
