import * as mdiIcons from '@mdi/js/commonjs/mdi.js';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { findIconDefinition, type IconLookup, library } from '@fortawesome/fontawesome-svg-core';
import type {
  IconPrefix,
  IconName,
  IconPathData
} from '@fortawesome/fontawesome-common-types';
import mapping from './mapping';

library.add(fas);

// MDI viewBox is always 24x24
const mdiViewBox: DOMRectInit = {
  x: 0,
  y: 0,
  width: 24,
  height: 24,
};

/**
 * Mapping status to help identify problems with the icon mapping
 */
export enum MappingStatus {
  EMPTY_MAPPING = 'empty_mapping',
  ORIGINAL = 'original',
  REMAPPED = 'remapped',
  UNKNOWN_MAPPING = 'unknown_mapping',
}

type SvgPathData = IconPathData;
type MappingResult = {
  icons: { [key: string]: SvgPathData };
  viewBoxes: { [key: string]: DOMRectInit };
  stats: { [key: string]: MappingStatus };
};
type AllFontAwesomeIDs = `${IconPrefix}-${IconName}` | string;

const remap = reMapIcons();

/**
 * Get the icon lookup object from the icon string
 * @param icon name as dash-case string consisting of "<IconPrefix>-<IconName>"
 * @returns IconLookup
 */
function getIconName(icon: AllFontAwesomeIDs): IconLookup {
  const prefix = <IconPrefix>icon.split('-', 1)[0] || '';
  if (!prefix) {
    throw new Error(
      `Icon "${icon}" not found. Expected format: <prefix>-<name>`,
    );
  }

  const iconName = <IconName>icon.slice(prefix.length + 1) || '';

  return {
    prefix,
    iconName,
  };
}

/**
 * Re-map the icons according to the mapping
 * Unknown and null mapping is ignored - original MDI icon will be used
 */
function reMapIcons(): MappingResult {
  const result: MappingResult = {
    icons: { ...mdiIcons },
    viewBoxes: {},
    stats: {},
  };

  for (const icon in result.icons) {
    // add the viewBox for the icon in order to build the template correctly
    result.viewBoxes[icon] = mdiViewBox;
    result.stats[icon] = MappingStatus.ORIGINAL;

    const mappedIconID = mapping.icons[icon as keyof typeof mapping.icons];

    // no mapping for the icon. Keep the original MDI icon
    if (mappedIconID === undefined) {
      continue;
    }

    // Mapping null if there is no equivalent in fontawesome
    if (mappedIconID === null) {
      console.error(`Icon mapping is empty. Fallback to source icon "${icon}"`);
      result.stats[icon] = MappingStatus.EMPTY_MAPPING;
      continue;
    }

    let iconDefinition;
    try {
      iconDefinition = findIconDefinition(getIconName(mappedIconID));

      if (iconDefinition === undefined) {
        throw new Error(`Icon "${mappedIconID}" not found in fontawesome`);
      }
    } catch (error) {
      console.error(
        `Mapped icon "${mappedIconID}" for "${icon}" not found. fallback to source icon "${icon}"`,
      );
      result.stats[icon] = MappingStatus.UNKNOWN_MAPPING;
      continue;
    }

    console.log(`Re-mapping "${icon}" to "${mappedIconID}"`);

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
