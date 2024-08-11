import moduleAliases from 'module-alias';
import path from 'path';

const rootPath = path.resolve(__dirname, '..', 'dist');
moduleAliases.addAliases({
  '@src': rootPath,
});
