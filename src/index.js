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

export class StylelintConfigBuilder {
    #config;

    constructor() {
        this.#config = {
            extends: [],
            rules: {},
        };
    }

    #replaceConfig(config) {
        this.#config = { ...config };

        return this;
    }

    #addExtendedConfig(config) {
        return this.#replaceConfig({
            ...this.#config,
            extends: this.#config.extends.includes(config) ? [...this.#config.extends] : [...this.#config.extends, config],
        });
    }

    addStandardConfig() {
        return this.#addExtendedConfig('stylelint-config-standard');
    }

    addStandardScssConfig() {
        return this.#addExtendedConfig('stylelint-config-standard-scss');
    }

    toConfig() {
        return {
            ...this.#config,
            extends: [...this.#config.extends],
            rules: { ...this.#config.rules },
        };
    }
}
