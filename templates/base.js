import { StylelintConfigBuilder } from '@tomaschochola/tooling-stylelint';

// eslint-disable-next-line no-restricted-exports
export default new StylelintConfigBuilder()
  .addStandardScssConfig()
  .addPrettierCompatibility()
  .toConfig();
