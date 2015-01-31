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

FOBO.ui.prototype.frontEndDiscounts.prototype.showPercentOffOnAllItemsWindow = function() {
    var form = Ext.create('Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        items: [{
            fieldLabel: 'Discount %',
            name: 'discount_percent',
            xtype: 'numberfield',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            minValue: 1,
            maxValue: 100,
            allowDecimals: true,
            step: 1
        }]
    });

    var win = Ext.create('Ext.window.Window', {
        title: 'Percent off on all items',
        modal: true
        ,bodyPadding: 5
        ,height: 115
        ,width: 350
        ,layout: 'fit'
        ,items: [form]
        ,buttons: [
            {
                text: 'Cancel',
                handler: function() {
                    win.close();
                }.bind( this )
            }, {
                text: 'Add',
                handler: function() {
                    // TODO
                }.bind( this )
            }
        ]
    });

    win.show();
}

FOBO.ui.prototype.frontEndDiscounts.prototype.showFreeDrinkDiscountWindow = function() {
    var form = Ext.create('Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        items: [{
            fieldLabel: 'Order amount',
            name: 'order_amount',
            xtype: 'numberfield',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            minValue: 1,
            maxValue: 100,
            allowDecimals: true,
            step: 1
        }]
    });

    var win = Ext.create('Ext.window.Window', {
        title: 'Free drink with order amount over',
        modal: true
        ,bodyPadding: 5
        ,height: 115
        ,width: 350
        ,layout: 'fit'
        ,items: [form]
        ,buttons: [
            {
                text: 'Cancel',
                handler: function() {
                    win.close();
                }.bind( this )
            }, {
                text: 'Add',
                handler: function() {
                    // TODO
                }.bind( this )
            }
        ]
    });

    win.show();
}

FOBO.ui.prototype.frontEndDiscounts.prototype.showFreeDishDiscountWindow = function() {
    var form = Ext.create('Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        items: [{
            fieldLabel: 'Order amount',
            name: 'order_amount',
            xtype: 'numberfield',
            allowBlank: true,
            labelAlign: 'right',
            tabIndex: 3,
            minValue: 1,
            maxValue: 100,
            allowDecimals: false,
            step: 1
        }]
    });

    var win = Ext.create('Ext.window.Window', {
        title: 'Free dish with order amount over',
        modal: true
        ,bodyPadding: 5
        ,height: 115
        ,width: 350
        ,layout: 'fit'
        ,items: [form]
        ,buttons: [
            {
                text: 'Cancel',
                handler: function() {
                    win.close();
                }.bind( this )
            }, {
                text: 'Add',
                handler: function() {
                    // TODO
                }.bind( this )
            }
        ]
    });

    win.show();
}

/**
 * @function Method used for creating and displaying the add discount window.
 */
FOBO.ui.prototype.frontEndDiscounts.prototype.showAddDiscountWindow = function() {
    var form = Ext.create('Ext.form.Panel', {
        bodyPadding: 10,
        border: false,
        items: [{
            xtype: 'fieldcontainer',
            defaultType: 'radiofield',
            defaults: {
                flex: 1
            },
            items: [
                {
                    boxLabel: 'Percent off on all items',
                    name: 'discount_type',
                    inputValue: 0,
                    id: 'discount_type_0'
                }, {
                    boxLabel: 'Free dish with order amount over',
                    name: 'discount_type',
                    inputValue: 1,
                    id: 'discount_type_1'
                }, {
                    boxLabel: 'Free drink with order amount over',
                    name: 'discount_type',
                    inputValue: 2,
                    id: 'discount_type_2'
                }
            ]
        }]
    });

    var win = Ext.create('Ext.window.Window', {
        title: 'Choose discount type',
        modal: true,
        width: 250,
        height: 200,
        layout: 'fit',
        items: [form],
        buttons: [
            {
                text: 'Cancel',
                handler: function() {
                    win.close();
                }.bind( this )
            }, {
                text: 'Add',
                handler: function() {
                    var discountType0 = Ext.getCmp('discount_type_0'),
                        discountType1 = Ext.getCmp('discount_type_1'),
                        discountType2 = Ext.getCmp('discount_type_2');

                    if (discountType0.getValue() === true) {
                        this.showPercentOffOnAllItemsWindow();
                        win.close();
                    } else if (discountType1.getValue() === true) {
                        this.showFreeDishDiscountWindow();
                        win.close();
                    } else if (discountType2.getValue() === true) {
                        this.showFreeDrinkDiscountWindow();
                        win.close();
                    }
                }.bind( this )
            }
        ]
    });

    win.show();
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
            rowBodyTpl : new Ext.XTemplate(
                '<b>Settings:</b><br/>{settings:this.discountSettings}</p>',
                {
                    discountSettings: function(value){
                        return value;
                    }
                })
        } ],
        columns: [
            { header: 'Type', dataIndex: 'type', width: 180,
                renderer: Util.textColumnRenderer
            }
        ],
        tbar: {
            items: [ {
                text: 'Add Discount',
                type: 'button',
                handler: this.showAddDiscountWindow.bind(this)
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