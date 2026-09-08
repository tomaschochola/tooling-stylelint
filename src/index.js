/**
 * @file
 * @author Tomáš Chochola <tomaschochola@tomaschochola.cz>
 * @copyright © 2026 Tomáš Chochola <tomaschochola@tomaschochola.cz>
 *
 * @license CC-BY-ND-4.0
 *
 * @see {@link https://creativecommons.org/licenses/by-nd/4.0/} License
 * @see {@link https://github.com/tomaschochola} GitHub Profile
 * @see {@link https://github.com/sponsors/tomaschochola} GitHub Sponsors
 */

const recommendedConfig = 'stylelint-config-recommended';
const recommendedScssConfig = 'stylelint-config-recommended-scss';
const scssFiles = Object.freeze(['**/*.scss']);
const standardConfig = 'stylelint-config-standard';
const standardScssConfig = 'stylelint-config-standard-scss';

export class StylelintConfigBuilder {
    #config;

    constructor() {
        this.#config = {
            extends: [],
            overrides: [],
            reportInvalidScopeDisables: true,
            reportNeedlessDisables: true,
            reportUnscopedDisables: true,
        };
    }

    #replaceConfig(config) {
        this.#config = { ...config };

        return this;
    }

    #addExtendedConfig(config) {
        const extendedConfigs = [...this.#config.extends];

        if (!extendedConfigs.includes(config)) {
            extendedConfigs.push(config);
        }

        return this.#replaceConfig({
            ...this.#config,
            extends: extendedConfigs,
        });
    }

    #addScssConfig(cssConfig, scssConfig) {
        this.#addExtendedConfig(cssConfig);

        const overrides = this.#config.overrides.map((override) => ({
            ...override,
            extends: [...override.extends],
            files: [...override.files],
        }));
        const existingOverride = overrides.find((override) => override.extends.includes(scssConfig));

        if (existingOverride === undefined) {
            overrides.push({
                extends: [scssConfig],
                files: [...scssFiles],
            });
        }

        return this.#replaceConfig({
            ...this.#config,
            overrides,
        });
    }

    addRecommendedConfig() {
        return this.#addExtendedConfig(recommendedConfig);
    }

    addStandardConfig() {
        return this.#addExtendedConfig(standardConfig);
    }

    addRecommendedScssConfig() {
        return this.#addScssConfig(recommendedConfig, recommendedScssConfig);
    }

    addStandardScssConfig() {
        return this.#addScssConfig(standardConfig, standardScssConfig);
    }

    toConfig() {
        return {
            ...this.#config,
            extends: [...this.#config.extends],
            overrides: this.#config.overrides.map((override) => ({
                ...override,
                extends: [...override.extends],
                files: [...override.files],
            })),
        };
    }
}
