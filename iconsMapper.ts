import * as mdiIcons from '@mdi/js/commonjs/mdi.js';

type SvgPathData = string;
type MappingResult = {
  icons: { [key: string]: SvgPathData };
};

const remap = reMapIcons();

function reMapIcons(): MappingResult {
  return {
    icons: { ...mdiIcons },
  };
}

export default {
  getIcons() {
    return remap;
  },
};
