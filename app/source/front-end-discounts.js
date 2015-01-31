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
 * @function Method used for creating the grid store.
 */
FOBO.ui.prototype.frontEndDiscounts.prototype.createStore = function() {
    this.store = Ext.create( 'Ext.data.JsonStore', {
        fields:[
            'id',
            'type'
        ],
        proxy:{
            type:'rest',
            url:'/api/front-end-discounts/',
            reader:{
                type: 'json',
                root:'data'
            }
        }
    } );
}

/**
 * @function Reloads the main grid panel data.
 */
FOBO.ui.prototype.frontEndDiscounts.prototype.refreshData = function() {
    // Reload data.
    this.panel.getStore().load();

    // Remove selection, and reset selection dependant buttons.
    this.panel.getView().getSelectionModel().deselectAll();
    this.editDiscountButton.setDisabled( true );
    this.deleteDiscountButton.setDisabled(true);
}

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.frontEndDiscounts.prototype.init = function() {
    this.createStore();

    this.editDiscountButton = Ext.create( 'Ext.button.Button', {
        text: 'Edit Discount',
        type: 'button',
        disabled: true
    } );

    this.deleteDiscountButton = Ext.create( 'Ext.button.Button', {
        text: 'Delete Discount',
        type: 'button',
        disabled: true
    } );

    // Panel itself.
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Front End Discounts',
        store: this.store,
        plugins: [ {
            ptype: 'rowexpander',
            rowBodyTpl : [
                '<p><b>Company:</b> {company}</p><br>',
                '<p><b>Summary:</b> {desc}</p>'
            ]
        } ],
        columns: [
            { header: 'Type', dataIndex: 'type', width: 180,
                renderer: Util.textColumnRenderer
            }
        ],
        tbar: {
            items: [ {
                text: 'Add Discount',
                type: 'button'
            }, this.editDiscountButton, this.deleteDiscountButton, {
                text: 'Refresh',
                type: 'button',
                handler: this.refreshData.bind( this )
            } ]
        },
        listeners: {
            itemclick: function() {
                this.editDiscountButton.setDisabled(false);
                this.deleteDiscountButton.setDisabled(false);
            }.bind( this )
        },
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            //store: this.store,
            displayInfo: true,
            displayMsg: 'Displaying topics {0} - {1} of {2}',
            emptyMsg: "No items to display"
        } )
    } );
}