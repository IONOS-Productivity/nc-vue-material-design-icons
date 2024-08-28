import * as mdiIcons from '@mdi/js/commonjs/mdi.js';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { findIconDefinition, library, IconLookup } from '@fortawesome/fontawesome-svg-core';
import mapping from './mapping';

/**
 * Mapping status to help identify problems with the icon mapping
 */
export enum MappingStatus {
  EMPTY_MAPPING = 'empty_mapping',
  ORIGINAL = 'original',
  REMAPPED = 'remapped',
  UNKNOWN_MAPPING = 'unknown_mapping',
}

library.add(fas);

// MDI viewBox is always 24x24
const mdiViewBox = {
  width: 24,
  height: 24,
};

const remap = reMapIcons();

/**
 * Get the icon lookup from the icon string
 * @param icon
 * @returns IconLookup
 */
function getIconName(icon: string): IconLookup {
  const prefix = icon.split('-', 1)[0];
  const iconName = icon.slice(prefix.length + 1);

  return {
    prefix,
    iconName,
  };
}

/**
 * Re-map the icons according to the mapping
 * Unknown and null mapping is ignored - original MDI icon will be used
 */
function reMapIcons() {
  const result = {
    icons: { ...mdiIcons },
    viewBoxes: {},
    stats: {},
  };

  for (const icon in result.icons) {
    // add the viewBox for the icon in order to build the template correctly
    result.viewBoxes[icon] = mdiViewBox;
    result.stats[icon] = MappingStatus.ORIGINAL;
    if (!mapping.icons.hasOwnProperty(icon)) {
      continue;
    }

    const newIconName = mapping.icons[icon];
    if (!newIconName) {
      console.error('mapped icon not set. fallback to source icon', icon);
      result.stats[icon] = MappingStatus.EMPTY_MAPPING;
      continue;
    }
    console.log('re-mapping', icon, 'to', newIconName);

    const iconDefinition = findIconDefinition(getIconName(newIconName));

    if (!iconDefinition) {
      console.error(
        'mapped icon not found. fallback to source icon',
        icon,
        newIconName,
      );
      result.stats[icon] = MappingStatus.UNKNOWN_MAPPING;
      continue;
    }

    result.icons[icon] = iconDefinition.icon[4];
    result.viewBoxes[icon] = {
      width: iconDefinition.icon[0],
      height: iconDefinition.icon[1],
    };
    result.stats[icon] = MappingStatus.REMAPPED;
  }

  return result;
}

export default {
  getIcons() {
    return remap;
  },
};
