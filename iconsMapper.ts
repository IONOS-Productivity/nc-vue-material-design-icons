import * as mdiIcons from '@mdi/js/commonjs/mdi.js';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import mapping from './mapping';

library.add(fas, fab, far);

// MDI viewBox is always 24x24
const mdiViewBox = {
  width: 24,
  height: 24,
};

const fallbackIcon = {
  path: mdiIcons.mdiHelp,
  viewBox: mdiViewBox,
};


const { icons, viewBoxes } = reMapIcons();

function getIconName(icon: string) {
  const prefix = icon.split('-', 1)[0];
  const iconName = icon.slice(prefix.length + 1);

  return {
    prefix,
    iconName,
  };
}

function reMapIcons() {
  const result = {
    icons: { ...mdiIcons },
    viewBoxes: {},
  };

  // iterate over the icons and re-map them
  for (const icon in result.icons) {
    // add the viewBox for the icon in order to build the template correctly
    result.viewBoxes[icon] = mdiViewBox;
    if (!mapping.icons.hasOwnProperty(icon)) {
      continue;
    }

    const newIconDefinition = mapping.icons[icon];
    console.log('re-mapping', icon, 'to', newIconDefinition);

    const { prefix, iconName } = getIconName(newIconDefinition);

    const iconDefinition = findIconDefinition({
      prefix: prefix,
      iconName: iconName,
    });

    if (!iconDefinition) {
      console.error('mapped icon not found', icon, newIconDefinition);
      result.icons[icon] = fallbackIcon.path;
      continue;
    }

    result.icons[icon] = iconDefinition.icon[4];
    result.viewBoxes[icon] = {
      width: iconDefinition.icon[0],
      height: iconDefinition.icon[1],
    };
  }

  return result;
}

export default {
  getIcons() {
    return icons;
  },
  getViewBoxes() {
    return viewBoxes;
  },
  getIconName,
};
