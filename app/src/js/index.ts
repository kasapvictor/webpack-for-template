import '../scss/home.scss';
import '../img/image2.jpg';
import '../img/image.jpeg';

import { Button } from './components';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (import.meta.webpackHot) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import.meta.webpackHot.accept();
}

Button({ containerName: 'button-wrapper', text: 'Button from JS1', cls: 'button' });

// eslint-disable-next-line no-console
console.log('HOME PAGE');
