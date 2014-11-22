/**
 * @fileOverview Loads Ext dependencies, configures it and prepares the main namespace.
 */

// Ext settings
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', './ux');

Ext.require([
    'Ext.selection.CheckboxModel',
    'Ext.ux.GMapPanel'
]);

/**
 * @nemspace Provides the application namespace.
 */
var FOBO = {
    /**
     * @function Method used for initialising the user interface, once Ext is ready.
     */
    init: function( ) {
        // Once ExtJS is ready, being drawing the main interface
        Ext.onReady( function() {
            new this.login( function() {
                var ui = new this.ui();
                ui.init();
            }.bind( this ) );
        }.bind( this ) );
    }
};