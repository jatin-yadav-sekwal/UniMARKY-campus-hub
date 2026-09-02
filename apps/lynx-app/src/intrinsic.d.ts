// src/intrinsic-elements.d.ts

import * as Lynx from '@lynx-js/types';

declare global {
  namespace JSX {
    interface IntrinsicElements extends Lynx.IntrinsicElements {
      // You can add custom elements here later if needed, e.g.:
      // 'my-custom': { prop1: string; onCustomEvent?: () => void };
    }
  }
}