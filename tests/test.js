import assert from 'node:assert/strict';
import test from 'node:test';

import defaultConfig, { StylelintConfigBuilder, baseConfig, recommendedCssConfig, recommendedScssConfig, standardCssConfig, standardScssConfig } from '@tomaschochola/tooling-stylelint';

test('baseConfig is a frozen plain object', () => {
    assert.equal(typeof baseConfig, 'object');
    assert.equal(Object.getPrototypeOf(baseConfig), Object.prototype);
    assert.equal(Object.isFrozen(baseConfig), true);
});

test('recommendedCssConfig is a frozen plain object', () => {
    assert.equal(typeof recommendedCssConfig, 'object');
    assert.equal(Object.getPrototypeOf(recommendedCssConfig), Object.prototype);
    assert.equal(Object.isFrozen(recommendedCssConfig), true);
});

test('recommendedScssConfig is a frozen plain object', () => {
    assert.equal(typeof recommendedScssConfig, 'object');
    assert.equal(Object.getPrototypeOf(recommendedScssConfig), Object.prototype);
    assert.equal(Object.isFrozen(recommendedScssConfig), true);
});

test('standardCssConfig is a frozen plain object', () => {
    assert.equal(typeof standardCssConfig, 'object');
    assert.equal(Object.getPrototypeOf(standardCssConfig), Object.prototype);
    assert.equal(Object.isFrozen(standardCssConfig), true);
});

test('standardScssConfig is a frozen plain object', () => {
    assert.equal(typeof standardScssConfig, 'object');
    assert.equal(Object.getPrototypeOf(standardScssConfig), Object.prototype);
    assert.equal(Object.isFrozen(standardScssConfig), true);
});

test('defaultConfig is a frozen plain object', () => {
    assert.equal(typeof defaultConfig, 'object');
    assert.equal(Object.getPrototypeOf(defaultConfig), Object.prototype);
    assert.equal(Object.isFrozen(defaultConfig), true);
});

test('StylelintConfigBuilder is a class constructor', () => {
    assert.equal(typeof StylelintConfigBuilder, 'function');

    const builder = new StylelintConfigBuilder();

    assert.ok(builder instanceof StylelintConfigBuilder);
});
