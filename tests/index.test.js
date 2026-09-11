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

const reportConfiguration = {
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,
    reportUnscopedDisables: true,
};

test('empty builder exposes explicit configuration collections', () => {
    assert.deepEqual(new StylelintConfigBuilder().toConfig(), {
        extends: [],
        overrides: [],
        ...reportConfiguration,
    });
});

test('SCSS profiles are scoped, idempotent, and isolated from caller mutation', () => {
    const builder = new StylelintConfigBuilder().addRecommendedScssConfig().addRecommendedScssConfig();

    const config = builder.toConfig();

    assert.deepEqual(config, {
        extends: ['stylelint-config-recommended'],
        overrides: [
            {
                extends: ['stylelint-config-recommended-scss'],
                files: ['**/*.scss'],
            },
        ],
        ...reportConfiguration,
    });

    config.extends.push('external-mutation');
    config.overrides[0].extends.push('external-mutation');
    config.overrides[0].files.push('**/*.sass');

    assert.equal(builder.toConfig().extends.includes('external-mutation'), false);
    assert.equal(builder.toConfig().overrides[0].extends.includes('external-mutation'), false);
    assert.equal(builder.toConfig().overrides[0].files.includes('**/*.sass'), false);
});

test('CSS configuration additions are idempotent and returned collections are isolated', () => {
    const builder = new StylelintConfigBuilder().addStandardConfig().addStandardConfig();

    const config = builder.toConfig();

    assert.deepEqual(config, {
        extends: ['stylelint-config-standard'],
        overrides: [],
        ...reportConfiguration,
    });

    config.extends.push('external-mutation');

    assert.equal(builder.toConfig().extends.includes('external-mutation'), false);
});

test('standard SCSS profile includes one global CSS base and one scoped override', () => {
    const config = new StylelintConfigBuilder().addStandardConfig().addStandardScssConfig().addStandardConfig().toConfig();

    assert.deepEqual(config, {
        extends: ['stylelint-config-standard'],
        overrides: [
            {
                extends: ['stylelint-config-standard-scss'],
                files: ['**/*.scss'],
            },
        ],
        ...reportConfiguration,
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

test('recommended configuration accepts CSS and rejects invalid CSS properties', async () => {
    const builder = new StylelintConfigBuilder().addRecommendedConfig();
    const valid = await lint(builder, '.item {\n  color: red;\n}\n', 'input.css');
    const invalid = await lint(builder, '.item {\n  unknown: value;\n}\n', 'input.css');

    assert.equal(valid.errored, false);
    assert.deepEqual(
        invalid.results[0].warnings.map(({ rule }) => rule),
        ['property-no-unknown'],
    );
});

test('recommended SCSS configuration accepts SCSS and rejects invalid CSS properties', async () => {
    const builder = new StylelintConfigBuilder().addRecommendedScssConfig();
    const valid = await lint(builder, '$color: red;\n\n.item {\n  color: $color;\n}\n', 'input.scss');
    const invalid = await lint(builder, '.item {\n  unknown: value;\n}\n', 'input.css');

    assert.equal(valid.errored, false);
    assert.deepEqual(
        invalid.results[0].warnings.map(({ rule }) => rule),
        ['property-no-unknown'],
    );
});

test('mixed profile parses CSS as CSS and SCSS as SCSS', async () => {
    const builder = new StylelintConfigBuilder().addRecommendedScssConfig();
    const css = await lint(builder, '.item { // invalid CSS\n  color: red;\n}\n', 'input.css');
    const scss = await lint(builder, '.item { // valid SCSS\n  color: red;\n}\n', 'input.scss');

    assert.equal(css.errored, true);
    assert.deepEqual(
        css.results[0].warnings.map(({ rule }) => rule),
        ['CssSyntaxError'],
    );
    assert.equal(scss.errored, false);
});

test('recommended CSS profile accepts portable modern syntax', async () => {
    const result = await lint(
        new StylelintConfigBuilder().addRecommendedConfig(),
        '@layer components {\n  .item {\n    color: oklch(from red l c h);\n\n    &:hover {\n      color: light-dark(black, white);\n    }\n  }\n}\n',
        'input.css',
    );

    assert.equal(result.errored, false);
});

test('configuration comments must be scoped, valid, and necessary', async () => {
    const builder = new StylelintConfigBuilder().addRecommendedConfig();
    const invalidScope = await lint(builder, '/* stylelint-disable unknown-rule */\n.item { color: red; }\n', 'input.css');
    const needless = await lint(builder, '/* stylelint-disable property-no-unknown */\n.item { color: red; }\n', 'input.css');
    const unscoped = await lint(builder, '/* stylelint-disable */\n.item { color: red; }\n', 'input.css');

    assert.deepEqual(
        invalidScope.results[0].warnings.map(({ rule }) => rule),
        ['--report-needless-disables', '--report-invalid-scope-disables'],
    );
    assert.deepEqual(
        needless.results[0].warnings.map(({ rule }) => rule),
        ['--report-needless-disables'],
    );
    assert.deepEqual(
        unscoped.results[0].warnings.map(({ rule }) => rule),
        ['--report-needless-disables', '--report-unscoped-disables'],
    );
});

test('css scaffold resolves to an executable Stylelint configuration', async () => {
    const { default: config } = await import('../scaffolds/css.js');

    const result = await stylelint.lint({
        code: '.item {\n  color: red;\n}\n',
        codeFilename: 'input.css',
        config,
    });

    assert.equal(result.errored, false);
    assert.deepEqual(config.extends, ['stylelint-config-recommended']);
    assert.deepEqual(config.overrides, []);
});

test('scss scaffold resolves to an executable Stylelint configuration', async () => {
    const { default: config } = await import('../scaffolds/scss.js');

    const result = await stylelint.lint({
        code: '$color: red;\n\n.item {\n  color: $color;\n}\n',
        codeFilename: 'input.scss',
        config,
    });

    assert.equal(result.errored, false);
    assert.deepEqual(config.extends, ['stylelint-config-recommended']);
    assert.deepEqual(config.overrides, [
        {
            extends: ['stylelint-config-recommended-scss'],
            files: ['**/*.scss'],
        },
    ]);
});
