const { propertyGroups } = require('stylelint-config-clean-order');

const propertiesOrder = propertyGroups.map((properties) => ({
  noEmptyLineBetween: true,
  emptyLineBefore: 'never', // Don't add empty lines between order groups.
  properties
}));

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order', 'stylelint-config-html'],
  rules: {
    'color-hex-length': null,
    'comment-empty-line-before': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'declaration-empty-line-before': null,
    // 'at-rule-empty-line-before': 'never',
    'order/properties-order': [
      propertiesOrder,
      {
        severity: 'error',
        unspecified: 'bottomAlphabetical'
      }
    ]
  }
};
