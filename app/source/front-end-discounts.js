/**
 * @fileOverview Hosts front-end discounts logic.
 */

/**
 * @constructor Constructor for the discounts class.
 */
FOBO.ui.prototype.frontEndDiscounts = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.frontEndDiscounts.prototype.init = function() {
    // Panel itself.
    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: "Front End Discounts"
        //,items: [ this.descriptionPanel, this.socialPanel, this.contactPanel, this.imageGridPanel ]
        ,layout: 'fit'
        ,listeners: {
            //render: this.loadSettings.bind( this )
        }
    } );
}