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
            'discount_type',
            'value'
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
                '<b>Notes:</b> {discount_type:this.discountNotes}<br/><b>Settings:</b> {[this.discountSettings(values)]}',
                {
                    discountNotes: function(value){
                        switch (value) {
                            case 0:
                                return "This discount applies to all orders.";
                                break;
                            case 1:
                            case 2:
                                return "The customer can choose this type of discount.";
                                break;
                            default:
                                return "Unknown discount type";
                                break;
                        }
                    },
                    discountSettings: function (values) {
                        switch (values.discount_type) {
                            case 0:
                                return "All customers are given a " + values.value + "% discount on website orders.";
                                break;
                            case 1:
                                return "Customer gets a free dish on orders over " + values.value + " GBP";
                                break;
                            case 2:
                                return "Customer gets a free drink on orders over " + values.value + " GBP";
                                break;
                            default:
                                return "Unknown discount type";
                                break;
                        }
                    }
                })
        } ],
        columns: [
            { header: 'Discount Type', dataIndex: 'discount_type', flex: 1, renderer: function(value) {
                    switch (value) {
                        case 0:
                            return "Percent off on all items";
                            break;
                        case 1:
                            return "Free dish with order amount over";
                            break;
                        case 2:
                            return "Free drink with order amount over";
                            break;
                        default:
                            return "Unknown discount type";
                            break;
                    }
                }
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
        }
    } );
}