/**
 * @fileOverview Hosts the settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.apiAccessTokenSettings = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.apiAccessTokenSettings.prototype.init = function() {
    // Panel itself.
    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: "API Access Token Settings"
        // TODO: Implement.
        ,items: []
        ,layout: 'fit'
    } );
}