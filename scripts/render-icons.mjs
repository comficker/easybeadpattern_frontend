// Renders Iconsax (iconsax.io) "linear" glyphs to public/icons/<name>.svg.
// Source: the vue-iconsax package (MIT). Run from a scratch folder with
//   npm i vue@3 @vue/server-renderer vue-iconsax@2.0.0 && node render-icons.mjs
// then copy out/*.svg into public/icons/. Add a line to MAP for a new icon.
import {createSSRApp, h} from 'vue'
import {renderToString} from '@vue/server-renderer'
import {writeFileSync, mkdirSync} from 'node:fs'
const MAP = {
  select: 'Mouse', brush: 'Brush2', eraser: 'Eraser', fill: 'Paintbucket', undo: 'RotateLeft', redo: 'RotateRight',
  'zoom-in': 'SearchZoomIn', 'zoom-out': 'SearchZoomOut', fit: 'Maximize4', bead: 'Record', flat: 'Grid1',
  upload: 'GalleryImport', pdf: 'DocumentDownload', image: 'Gallery', 'image-clear': 'GallerySlash', swatch: 'ColorSwatch',
  palette: 'Colorfilter', close: 'CloseCircle', trash: 'Trash', text: 'Text', patterns: 'Category', beadwork: 'Scissor',
  fuse: 'Element3', 'arrow-left': 'ArrowLeft2', 'arrow-right': 'ArrowRight2', 'arrow-down': 'ArrowDown2', tick: 'TickCircle',
  info: 'InfoCircle', options: 'Setting4', swap: 'Repeat', refresh: 'Refresh2', play: 'Play', pause: 'Pause', heart: 'Heart', search: 'SearchNormal1',
  filter: 'Filter', more: 'More', add: 'Add', minus: 'Minus', eye: 'Eye', share: 'Share', save: 'Save2', user: 'ProfileCircle',
  login: 'Login', printer: 'Printer', ruler: 'Ruler', magic: 'MagicStar', home: 'Home2', menu: 'HambergerMenu', task: 'TaskSquare',
  box: 'BoxAdd', timer: 'Timer1', layers: 'Layer', edit: 'Edit2', export: 'ExportSquare', book: 'Book1', lamp: 'LampOn', star: 'Star1',
}
mkdirSync('out', {recursive: true})
for (const [name, comp] of Object.entries(MAP)) {
  let C
  try { C = (await import(`./node_modules/vue-iconsax/dist/components/icons/${comp}.vue.js`)).default } catch { console.log('missing', comp); continue }
  const html = await renderToString(createSSRApp({render: () => h(C, {type: 'linear', color: '#000', size: 24, strokeWidth: '1.5'})}))
  const svg = html.replace(/<!--.*?-->/g, '').replace(/ width="24" height="24"/, '')
  writeFileSync(`out/${name}.svg`, svg)
}
console.log('done')
