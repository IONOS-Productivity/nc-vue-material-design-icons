import * as mdiIcons from '@mdi/js/commonjs/mdi.js';

const remap = reMapIcons();

function reMapIcons() {
  return {
    icons: { ...mdiIcons },
  };
}

export default {
  getIcons() {
    return remap;
  },
};
