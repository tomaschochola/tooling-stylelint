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

import assert from 'node:assert/strict';
import test from 'node:test';
import stylelint from 'stylelint';
import { StylelintConfigBuilder } from '../src/index.js';

const lint = async (builder, code, codeFilename) =>
    stylelint.lint({
        code,
        codeFilename,
        config: builder.toConfig(),
    });

test('empty builder exposes explicit configuration collections', () => {
    assert.deepEqual(new StylelintConfigBuilder().toConfig(), {
        extends: [],
        rules: {},
    });
});

test('configuration additions are idempotent and returned collections are isolated', () => {
    const builder = new StylelintConfigBuilder().addStandardScssConfig().addStandardScssConfig();

    const config = builder.toConfig();

    assert.deepEqual(config, {
        extends: ['stylelint-config-standard-scss'],
        rules: {},
    });

    config.extends.push('external-mutation');
    config.rules['external-rule'] = true;

    assert.equal(builder.toConfig().extends.includes('external-mutation'), false);
    assert.equal(builder.toConfig().rules['external-rule'], undefined);
});

test('standard configuration additions are idempotent and returned collections are isolated', () => {
    const builder = new StylelintConfigBuilder().addStandardConfig().addStandardConfig();

    const config = builder.toConfig();

    assert.deepEqual(config, {
        extends: ['stylelint-config-standard'],
        rules: {},
    });

    config.extends.push('external-mutation');
    config.rules['external-rule'] = true;

    assert.equal(builder.toConfig().extends.includes('external-mutation'), false);
    assert.equal(builder.toConfig().rules['external-rule'], undefined);
});

test('standard and SCSS configurations can be combined without duplication', () => {
    const config = new StylelintConfigBuilder().addStandardConfig().addStandardScssConfig().addStandardConfig().toConfig();

    assert.deepEqual(config, {
        extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
        rules: {},
    });
});

test('standard SCSS configuration accepts SCSS and rejects invalid CSS properties', async () => {
    const builder = new StylelintConfigBuilder().addStandardScssConfig();
    const valid = await lint(builder, '$color: red;\n\n.item {\n  color: $color;\n}\n', 'input.scss');
    const invalid = await lint(builder, '.item {\n  unknown: value;\n}\n', 'input.css');

    assert.equal(valid.errored, false);
    assert.deepEqual(
        invalid.results[0].warnings.map(({ rule }) => rule),
        ['property-no-unknown'],
    );
});

test('standard configuration accepts CSS and rejects invalid CSS properties', async () => {
    const builder = new StylelintConfigBuilder().addStandardConfig();
    const valid = await lint(builder, '.item {\n  color: red;\n}\n', 'input.css');
    const invalid = await lint(builder, '.item {\n  unknown: value;\n}\n', 'input.css');

    assert.equal(valid.errored, false);
    assert.deepEqual(
        invalid.results[0].warnings.map(({ rule }) => rule),
        ['property-no-unknown'],
    );
});

test('copy template resolves to an executable Stylelint configuration', async () => {
    const { default: config } = await import('../templates/recommended.js');

    const result = await stylelint.lint({
        code: '.item {\n  color: red;\n}\n',
        codeFilename: 'input.scss',
        config,
    });

    assert.equal(result.errored, false);
    assert.deepEqual(config.extends, ['stylelint-config-standard-scss']);
});

test('standard template resolves to an executable Stylelint configuration', async () => {
    const { default: config } = await import('../templates/standard.js');

    const result = await stylelint.lint({
        code: '.item {\n  color: red;\n}\n',
        codeFilename: 'input.css',
        config,
    });

    assert.equal(result.errored, false);
    assert.deepEqual(config.extends, ['stylelint-config-standard']);
});
