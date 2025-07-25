import { Highlight } from '@tiptap/extension-highlight';

export const CustomHighlight = Highlight.configure({ multicolor: true }).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
        parseHTML: element => element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes['color']) {
            return {};
          }
          return {
            style: `background-color: ${attributes['color']}; color: inherit;`,
          };
        },
      },
    };
  },
});

export interface ColorConfig { 
  base: string;
  hover: string;
}

export interface CoverImage {
  name: string;
  dataUrl: string;
}

export interface fontColorConfig {
  name: string;
  hex: string;
}

export interface highlightColorConfig {
  name: string;
  hex: string;
}

export interface LabelItem {
  color: string;
  hover: string;
}

export const imageDisplayLimit = 6;

export const predefinedImages = [
  { url: 'assets/images/city.avif' },
  { url: 'assets/images/cloud.avif' },
  { url: 'assets/images/la.avif' },
  { url: 'assets/images/miami.avif' },
  { url: 'assets/images/stars.avif' },
  { url: 'assets/images/tokio.avif' }
];

export const coverColors: ColorConfig[] = [
  { base: '#4bce97', hover: '#7ee2b8' },
  { base: '#f5cd47', hover: '#e2b203' },
  { base: '#fea362', hover: '#fec195' },
  { base: '#f87168', hover: '#fd9891' },
  { base: '#9f8fef', hover: '#b8acf6' },
  { base: '#579dff', hover: '#85b8ff' },
  { base: '#6cc3e0', hover: '#9dd9ee' },
  { base: '#94c748', hover: '#b3df72' },
  { base: '#e774bb', hover: '#f797d2' },
  { base: '#8590a2', hover: '#b3b9c4' }
];

export const designColors: fontColorConfig[] = [
  { name: 'Farbe 1', hex: '#ffffff' },
  { name: 'Farbe 2', hex: '#000000' },
  { name: 'Farbe 3', hex: '#e8e8e8' },
  { name: 'Farbe 4', hex: '#0e2841' },
  { name: 'Farbe 5', hex: '#156082' },
  { name: 'Farbe 6', hex: '#e97132' },
  { name: 'Farbe 7', hex: '#196b24' },
  { name: 'Farbe 8', hex: '#0f9ed5' },
  { name: 'Farbe 9', hex: '#a02b93' },
  { name: 'Farbe 10', hex: '#4ea72e' }
];

export const primaryColors: fontColorConfig[] = [
  { name: 'Farbe 1', hex: '#f2f2f2' },
  { name: 'Farbe 2', hex: '#7f7f7f' },
  { name: 'Farbe 3', hex: '#d0d0d0' },
  { name: 'Farbe 4', hex: '#dbe9f7' },
  { name: 'Farbe 5', hex: '#c1e4f5' },
  { name: 'Farbe 6', hex: '#fae2d6' },
  { name: 'Farbe 7', hex: '#c1f0c8' },
  { name: 'Farbe 8', hex: '#caedfb' },
  { name: 'Farbe 9', hex: '#f1ceee' },
  { name: 'Farbe 10', hex: '#d9f2d0' },
  { name: 'Farbe 11', hex: '#d8d8d8' },
  { name: 'Farbe 12', hex: '#595959' },
  { name: 'Farbe 13', hex: '#aeaeae' },
  { name: 'Farbe 14', hex: '#a6c9eb' },
  { name: 'Farbe 15', hex: '#83caeb' },
  { name: 'Farbe 16', hex: '#f6c6ac' },
  { name: 'Farbe 17', hex: '#84e291' },
  { name: 'Farbe 18', hex: '#95dcf7' },
  { name: 'Farbe 19', hex: '#e49edd' },
  { name: 'Farbe 20', hex: '#b3e5a1' },
  { name: 'Farbe 21', hex: '#bfbfbf' },
  { name: 'Farbe 22', hex: '#3f3f3f' },
  { name: 'Farbe 23', hex: '#747474' },
  { name: 'Farbe 24', hex: '#4d94d8' },
  { name: 'Farbe 25', hex: '#45b0e1' },
  { name: 'Farbe 26', hex: '#f1a984' },
  { name: 'Farbe 27', hex: '#47d45a' },
  { name: 'Farbe 28', hex: '#60cbf3' },
  { name: 'Farbe 29', hex: '#d76dcc' },
  { name: 'Farbe 30', hex: '#8ed873' },
  { name: 'Farbe 31', hex: '#a5a5a5' },
  { name: 'Farbe 32', hex: '#262626' },
  { name: 'Farbe 33', hex: '#3a3a3a' },
  { name: 'Farbe 34', hex: '#215e99' },
  { name: 'Farbe 35', hex: '#0f4861' },
  { name: 'Farbe 36', hex: '#bf4f14' },
  { name: 'Farbe 37', hex: '#12501b' },
  { name: 'Farbe 38', hex: '#0b769f' },
  { name: 'Farbe 39', hex: '#78206e' },
  { name: 'Farbe 40', hex: '#3a7d22' },
  { name: 'Farbe 41', hex: '#7f7f7f' },
  { name: 'Farbe 42', hex: '#0c0c0c' },
  { name: 'Farbe 43', hex: '#171717' },
  { name: 'Farbe 44', hex: '#153d64' },
  { name: 'Farbe 45', hex: '#0a3041' },
  { name: 'Farbe 46', hex: '#7f340d' },
  { name: 'Farbe 47', hex: '#0c3512' },
  { name: 'Farbe 48', hex: '#074f6a' },
  { name: 'Farbe 49', hex: '#501549' },
  { name: 'Farbe 50', hex: '#265316' },
];

export const standardColors: fontColorConfig[] = [
  { name: 'Farbe 1', hex: '#c00000' },
  { name: 'Farbe 2', hex: '#ee0000' },
  { name: 'Farbe 3', hex: '#ffc000' },
  { name: 'Farbe 4', hex: '#ffff00' },
  { name: 'Farbe 5', hex: '#92d050' },
  { name: 'Farbe 6', hex: '#00b050' },
  { name: 'Farbe 7', hex: '#00b0f0' },
  { name: 'Farbe 8', hex: '#0070c0' },
  { name: 'Farbe 9', hex: '#002060' },
  { name: 'Farbe 10', hex: '#7030a0' },
];

export const highlightColors: highlightColorConfig[] = [
  { name: 'Farbe 1', hex: '#ffff00' },
  { name: 'Farbe 2', hex: '#00ff00' },
  { name: 'Farbe 3', hex: '#00ffff' },
  { name: 'Farbe 4', hex: '#ff00ff' },
  { name: 'Farbe 5', hex: '#0000ff' },
  { name: 'Farbe 6', hex: '#ff0000' },
  { name: 'Farbe 7', hex: '#000080' },
  { name: 'Farbe 8', hex: '#008080' },
  { name: 'Farbe 9', hex: '#008000' },
  { name: 'Farbe 10', hex: '#800080' },
  { name: 'Farbe 11', hex: '#800000' },
  { name: 'Farbe 12', hex: '#808000' },
  { name: 'Farbe 13', hex: '#808080' },
  { name: 'Farbe 14', hex: '#c0c0c0' },
  { name: 'Farbe 15', hex: '#000000' },
];

export const labelColors: LabelItem[] = [
  { color: '#baf3db', hover: '#7ee2b8' },
  { color: '#f8e6a0', hover: '#f5cd47' },
  { color: '#fedec8', hover: '#fec195' },
  { color: '#ffd5d2', hover: '#fd9891' },
  { color: '#dfd8fd', hover: '#b8acf6' },
  { color: '#4bce97', hover: '#7ee2b8' },
  { color: '#f5cd47', hover: '#e2b203' },
  { color: '#fea362', hover: '#fec195' },
  { color: '#f87168', hover: '#fd9891' },
  { color: '#9f8fef', hover: '#b8acf6' },
  { color: '#1f845a', hover: '#216e4e' },
  { color: '#946f00', hover: '#7f5f01' },
  { color: '#c25100', hover: '#a54800' },
  { color: '#c9372c', hover: '#ae2e24' },
  { color: '#6e5dc6', hover: '#5e4db2' },
  { color: '#cce0ff', hover: '#85b8ff' },
  { color: '#c6edfb', hover: '#9dd9ee' },
  { color: '#d3f1a7', hover: '#b3df72' },
  { color: '#fdd0ec', hover: '#f797d2' },
  { color: '#dcdfe4', hover: '#b3b9c4' },
  { color: '#579dff', hover: '#85b8ff' },
  { color: '#6cc3e0', hover: '#9dd9ee' },
  { color: '#94c748', hover: '#b3df72' },
  { color: '#e774bb', hover: '#f797d2' },
  { color: '#8590a2', hover: '#b3b9c4' },
  { color: '#0c66e4', hover: '#0055cc' },
  { color: '#227d9b', hover: '#206a83' },
  { color: '#5b7f24', hover: '#4c6b1f' },
  { color: '#ae4787', hover: '#943d73' },
  { color: '#626f86', hover: '#44546f' }
];