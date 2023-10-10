/** @covers $.mage.__('Example text') */
export const REGEX_MAGE_TRANSLATE = /mage\.__\(\s*(['"])(.*?[^\\])\1.*?[),]/g

/**
 * @covers $t(' Example: ')
 * @covers <a data-bind="attr: { title: $t('Title'), href: '#'} "></a>
 * @covers <input type="text" data-bind="attr: { placeholder: $t('Placeholder'), title: $t('Title') }" />
 */
export const REGEX_TRANSLATE_FUNCTION = /(\$t\(\s*(['"])(.*?[^\\])\2.*?[),])/g

/**
 * @covers <span><!-- ko i18n: 'Next'--><!-- /ko --></span>
 * @covers <th class="col col-method" data-bind="i18n: 'Select Method'"></th>
 */
export const REGEX_I18N_BINDING = /i18n:\s?'([^'\\]*(?:\\.[^'\\]*)*)'/g

/**
 * @covers <translate args="'System Messages'"/>
 * @covers <span translate="'Examples'"></span>
 */
export const REGEX_TRANSLATE_TAG_OR_ATTR =
  /translate( args|)="\'([^"\\]*(?:\\.[^"\\]*)*)'"/g
