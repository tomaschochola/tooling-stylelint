import { StylelintConfigBuilder } from '@tomaschochola/tooling-stylelint';

export default new StylelintConfigBuilder()
    .addRecommendedConfig()
    // Replace the preceding recommended profile with .addStandardConfig() when its complete policy is desired.
    // .addStandardConfig()
    .toConfig();
