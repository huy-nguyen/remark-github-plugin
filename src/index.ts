import {
  Options,
  transform,
} from './transform';

const attacher = (options: Options) => {
  return transform(options);
};

export default attacher;
