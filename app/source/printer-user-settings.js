/**
 * @fileOverview Hosts the settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.printerUserSettings = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.printerUserSettings.prototype.init = function() {
    // Panel itself.
    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: "Printer Settings"
        // TODO: Implement.
        ,items: []
        ,layout: 'fit'
    } );
}