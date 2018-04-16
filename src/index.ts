import {
  IOptions,
  transform,
} from './transform';

const attacher = (options: IOptions) => {
  return transform(options);
};

export default attacher;
