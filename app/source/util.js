/**
 * @namespace Utilities.
 */
var Util = {
    // HTML encode values, if not empty.
    textColumnRenderer: function(value) {
        if (value) {
            return Ext.util.Format.htmlEncode(value);
        }
        return value;
    }
};