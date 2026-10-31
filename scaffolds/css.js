import { StylelintConfigBuilder } from '@tomaschochola/tooling-stylelint';

export default new StylelintConfigBuilder()
    .addRecommendedConfig()
    // .addStandardConfig()
    .toConfig();
