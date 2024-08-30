#!/usr/bin/env -S node -r ts-node/register/transpile-only

import * as mdiIcons from '@mdi/js/commonjs/mdi.js';
import iconsMapper from './iconsMapper';
import mapping from './mapping';
import path from 'path';
import { existsSync } from 'fs';
import { mkdir, appendFile, writeFile } from 'fs/promises';

const filename = 'mapping.html';
const icons = iconsMapper.getIcons();
const viewBoxFa = iconsMapper.getViewBoxes();
const dist = path.resolve(__dirname, 'docs');

const viewBoxMdi = {
  width: 24,
  height: 24,
};

function renderTemplate(title: string, svgPathData: string, viewBox: object) {
  return `
  <span class="material-design-icon ${title}-icon"
        role="img">
    <svg fill="currentColor"
         class="material-design-icon__svg"
         viewBox="0 0 ${viewBox.width} ${viewBox.height}">
      <path d="${svgPathData}">
        <title>${title}</title>
      </path>
    </svg>
  </span>
`;
}

/**
 * Get the SVG data for a given MDI icon
 * @param id
 */
function getSvgDataMDI(id: string) {
  const splitID = id.split(/(?=[A-Z])/).slice(1);

  const name = splitID.join('');

  // This is a hacky way to remove the 'mdi' prefix, so "mdiAndroid" becomes
  // "android", for example
  const title = splitID.join('-').toLowerCase();

  return {
    id,
    name,
    title,
    svgPathData: mdiIcons[id],
  };
}

function templateHeader() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapping MDI to Fontawesome</title>
    <style>
      .material-design-icon {
          display: inline-block;
          margin: 4px;
          outline: 2px solid yellow;
      }
      .material-design-icon__svg {
        width: 32px;
        height: 32px;
      }

      .shrink {
        flex: 0 1!important;
      }

      body {
        font-family: 'Helvetica', sans-serif;
      }
      .main-container {
        width: 100%;
        height: 100%;
        display: flex;
        margin: 0;
        justify-content: left;
        background-color: #fafafa;
      }

      .table-container {
        display: flex;
        flex-flow: column nowrap;
        background-color: white;
        width: 600px;
        margin: 0 auto;
        border-radius: 4px;
        border: 1px solid #DADADA;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, .08);
      }

      .table-row {
        display: flex;
        flex-flow: row nowrap;
        width: 100%;
        border-bottom: 1px solid #dadada;
      }

      .heading {
        background-color: #ececec;
        color: #3e3e3e;
        font-weight: bold;
        position: sticky;
        top: 0;
      }

      .row-item {
        display: flex;
        flex: 1;
        font-size: 14px;
        padding: 0 0;
        justify-content: center;
        align-items: center;
        transition: all 0.15s ease-in-out;
      }

      .row-item:hover {
        cursor: pointer;
        background-color: #F0F0F0;
      /*   box-shadow: 0px 1px 4px rgba(0, 0, 0, .08); */
      }

      .row-sub-container {
        display: flex;
        flex-flow: column nowrap;
        flex: 1;
      }

      .row-sub-container .row-item {
        padding: 8px 0;
        border-bottom: 1px solid #dadada;
      }

      .table-row:last-child,
      .row-sub-container .row-item:last-child {
        border-bottom: 0;
      }
    </style>
  </head>
  <body>
  <div class="main-container">
    <div class="table-container">
      <div class="table-row heading">
        <div class="row-item">MDI ID</div>
        <div class="row-item shrink"></div>
        <div class="row-item shrink"></div>
        <div class="row-item">Font Awesome id</div>
      </div>
`;
}

function templateFooter() {
  return `  </div>
  </div>
  </body>`;
}

async function build() {
  if (!existsSync(dist)) {
    await mkdir(dist);
  }

  await writeFile(path.resolve(dist, filename), templateHeader());
  for (const mdiIconId in mapping.icons) {
    const faID = mapping.icons[mdiIconId];
    const faSVGPath = icons[mdiIconId];
    const { iconName: faIconName } = iconsMapper.getIconName(faID);

    const mdiIconData = getSvgDataMDI(mdiIconId);
    const mdiSVG = renderTemplate(
      mdiIconData.name,
      mdiIconData.svgPathData,
      viewBoxMdi,
    );

    const viewBoxDefault = {
      width: 24,
      height: 24,
    };

    const viewBox = viewBoxFa[mdiIconId] || viewBoxDefault;

    const faSVG = renderTemplate(faID, faSVGPath, viewBox);

    const htmlRow = `
  <div class="table-row">
    <div class="row-item"><a href="https://pictogrammers.com/library/mdi/icon/${mdiIconData.title}/" target="_blank">${mdiIconData.name}</a></div>
    <div class="row-item shrink">${mdiSVG}</div>
    <div class="row-item shrink">${faSVG}</div>
    <div class="row-item"><a href="https://fontawesome.com/icons/${faIconName}?f=classic&s=solid" target="_blank">${faIconName}</a></div>
  </div>
`;
    await appendFile(path.resolve(dist, filename), htmlRow);
  }
  await appendFile(path.resolve(dist, filename), templateFooter());
}

build().catch((err: unknown) => {
  console.log(err);
});
