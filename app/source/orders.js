/**
 * @fileOverview Hosts the orders panel and components.
 */

/**
 * @constructor Constructor for the orders class.
 */
FOBO.ui.prototype.orders = function() {
    this.init();
};

/**
 * @function Creates a window used for generating orders.
 */
FOBO.ui.prototype.orders.prototype.createOrderWindowStore = function(order) {
    this.orderWindowStore = Ext.create( 'Ext.data.JsonStore', {
        fields:[ 'id', 'count', { name: 'category_id', type: 'int' }, 'item_name', 'size_id', 'price', 'item_number' ],
        autoLoad: {
            callback: this.populateWithOrderData.bind( this )
        },
        proxy:{
            type:'rest',
            // If no order is set put an id of 0, to have default counts included. If an order is set, pass in the
            // the order id to get counts.
            url:'/api/menu-items/?order_id=' + (order ? order.id : 0),
            reader: {
                type: 'json',
                root:'data'
            }
        }
    } );
}

/**
 * @function Reloads the main grid panel data.
 */
FOBO.ui.prototype.orders.prototype.refreshData = function() {
    // Clear search fields.
    this.orderTypeSearchCombo.clearValue();
    this.deliveryTypeSearchCombo.clearValue();
    this.customerTypeSearchCombo.clearValue();
    this.paymentStatusSearchCombo.clearValue();
    this.customerNameSearchField.setValue();
    this.phoneNumberSearchField.setValue();
    this.referenceSearchField.setValue();

    this.cancelOrderButton.setDisabled(true);
    this.acceptOrderButton.setDisabled(true);
    this.rejectOrderButton.setDisabled(true);

    // Reload data.
    this.panel.getStore().load();
}

/**
 * @function Creates combo stores for delivery, order and customer types, and payment statuses.
 */
FOBO.ui.prototype.orders.prototype.createComboStores = function() {
    this.deliveryTypeComboStore = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'delivery_type' ],
        data : Common.OrderConstants.DeliveryTypes
    } );
    this.orderTypeComboStore = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'order_type' ],
        data : Common.OrderConstants.OrderTypes
    } );
    this.customerTypeComboStore  = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'customer_type' ],
        data : Common.OrderConstants.CustomerTypes
    } );
    this.paymentStatusComboStore = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'payment_status' ],
        data : Common.OrderConstants.PaymentStatuses
    } );
};

/**
 * Creates and shows the add or edit customer window.
 */
FOBO.ui.prototype.orders.prototype.createAddCustomerWindow = function( customerId, customerData ) {
    // Create the customer edit / view window.
    var win = new FOBO.shared.customerWindow(customerId, customerData, function() {
        // Upon success, re-set the configured customer values on the order form.
        if ( customerId ) {
            this.customerNameField.setValue();
            this.phoneNumberField.setValue();
            this.addressField.setValue();
            this.postCodeField.setValue();
            this.editCustomerButton.setDisabled( true );
            // TODO: Select the value, not just reload and remove data.
        }
        // And reload data.
        this.customerNameField.store.load();
    }.bind(this));

    // Display it.
    win.window.show();
}

/**
 * Method used for displaying selected front end order discounts window.
 * @function
 */
FOBO.ui.prototype.orders.prototype.createFrontEndDiscountsWindow = function(order) {
    var height = 83, win, discountLabelFields = [], i;

    for (i = 0; i < order.front_end_discounts.length; i++) {
        discountLabelFields.push(Ext.create('Ext.form.field.Text', {
            fieldLabel: 'Name',
            value: order.front_end_discounts[i].discount_name,
            readOnly: true,
            labelAlign: 'right',
            labelWidth: 80,
            width: 670
        }));
        height += 30;
    }

    win = Ext.create('Ext.window.Window', {
        width: 700,
        height: height,
        modal: true,
        bodyPadding: 5,
        title: 'Selected Front End Discounts',
        items: [
            Ext.create('Ext.form.Panel', {
                frame: false,
                border: false,
                items: discountLabelFields
            })
        ]
        ,buttons: [
            {
                text: 'Close',
                handler: function() {
                    win.close();
                }.bind( this )
            }
        ]
    });

    win.show();
}

/**
 * @function Creates and shows an order window.
 */
FOBO.ui.prototype.orders.prototype.createNewOrderWindow = function( order ) {
    // Stores the selected customer data (see drop down, below).
    this._selectedCustomer = null;

    // Used for populating the form with order data.
    this.populateWithOrderData = function() {
        if ( order ) {
            // Begin populating form.
            this.orderReferenceField.setValue( order.reference );
            this.orderTypeCombo.setValue( order.order_type );
            this.deliveryTypeCombo.setValue( order.delivery_type );
            this.customerTypeCombo.setValue( order.customer_type );
            this.paymentStatusCombo.setValue( order.payment_status );
            this.totalField.setValue( order.total_price ? order.total_price : 0 );
            this.frontEndDiscountsTotalField.setValue( order.front_end_discounts_total );
            if (order.front_end_discounts.length !== 0) {
                this.viewFrontEndDiscountsButton.setDisabled( false );
            }
            this.discountField.setValue( order.discount );
            this.finalField.setValue( ( order.total_price - order.front_end_discounts_total - order.discount * order.total_price / 100 ).toFixed( 2 ) );
            // Set the combo value, only after data is loaded.
            this.customerNameField.getStore().load(function() {
                // If a customer id is set, the the value using that id.
                if (order.customer_id) {
                    this.customerNameField.setValue( order.customer_id );
                } else {
                    // Else, set the raw name.
                    this.customerNameField.setRawValue( order.customer_name );
                }
                // Set the customer details only after the customer dd value is selected,
                // to make sure if a custom address is used, this is not overwritten.
                this.phoneNumberField.setValue( order.customer_phone_number );
                this.addressField.setValue( order.delivery_address );
                this.postCodeField.setValue( order.post_code );
            }.bind(this));
            this.notesField.setValue( new String(order.notes) );
        }
    }

    // TODO: Avoid doing this step twice.
    this.createOrderWindowStore(order);

    this.categoryComboStore = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'category_name' ],
        data : Common.FoodMenu.MenuItemCategories
    } );
    this.sizeComboStore = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'size_name' ],
        data : Common.FoodMenu.MenuItemSizes
    } );

    this.searchFoodByNameAndCategory = function() {
        // Reload panel data.
        this.menuItemsGrid.getStore().load( {
            params: {
                category_id: this.categoryComboSearch.getValue(),
                item_name: this.foodNameSearchInput.getValue()
            }
        } );
    }

    this.refreshMenuItemData = function() {
        // Re-set search fields
        this.categoryComboSearch.clearValue();
        this.foodNameSearchInput.setValue();

        // Reload panel data.
        this.menuItemsGrid.getStore().load();
    }

    // Prepare input fields
    this.foodNameSearchInput = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Name',
        width: 250,
        labelWidth: 50,
        labelAlign: 'right',
        xtype: 'textfield'
    } );

    this.orderReferenceField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Reference',
        width: 400,
        labelWidth: 180,
        labelAlign: 'right',
        xtype: 'textfield'
    } );

    this.categoryComboSearch = Ext.create('Ext.form.ComboBox', {
        // TODO: Add empty value.
        fieldLabel: 'Category',
        store: this.categoryComboStore,
        name: 'category_id',
        queryMode: 'local',
        displayField: 'category_name',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        tabIndex: 1
    } );

    // Create fields.
    this.orderTypeCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Order Type',
        store: this.orderTypeComboStore,
        name: 'order_type',
        queryMode: 'local',
        displayField: 'order_type',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        allowBlank: false,
        wdith: 400,
        labelWidth: 180,
        listeners: {
            change: function(combo, value ) {
                if ( value === 0 || value === 3 ) {
                    this.addressField.setVisible( false );
                    this.postCodeField.setVisible( false );
                    this.customerNameField.setVisible( false );
                    this.editCustomerButton.setVisible( false );
                    this.addCustomerButton.setVisible( false );
                    this.phoneNumberField.setVisible( false );
                    this.deliveryTypeCombo.setVisible( false );

                    this.postCodeField.setValue( "" );
                    this.addressField.setValue( "" );
                    this.customerNameField.setValue( "" );
                    this.phoneNumberField.setValue( "" );
                    this.deliveryTypeCombo.clearValue();

                    this.postCodeField.allowBlank = true;
                    this.addressField.allowBlank = true;
                    this.customerNameField.allowBlank = true;
                    this.phoneNumberField.allowBlank = true;
                    this.deliveryTypeCombo.allowBlank = true;
                } else {
                    this.addressField.setVisible( true );
                    this.postCodeField.setVisible( true );
                    this.customerNameField.setVisible( true );
                    this.editCustomerButton.setVisible( true );
                    this.addCustomerButton.setVisible( true );
                    this.phoneNumberField.setVisible( true );
                    this.deliveryTypeCombo.setVisible( true );

                    this.postCodeField.allowBlank = false;
                    this.addressField.allowBlank = false;
                    this.customerNameField.allowBlank = false;
                    this.phoneNumberField.allowBlank = false;
                    this.deliveryTypeCombo.allowBlank = false;
                }
            }.bind( this )
        }
    } );

    this.deliveryTypeCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Delivery Type',
        store: this.deliveryTypeComboStore,
        name: 'delivery_type',
        queryMode: 'local',
        displayField: 'delivery_type',
        valueField: 'id',
        width: 400,
        labelAlign: 'right',
        editable: false,
        allowBlank: false,
        labelWidth: 180
    } );

    this.customerTypeCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Customer Type',
        store: this.customerTypeComboStore,
        name: 'customer_type',
        queryMode: 'local',
        displayField: 'customer_type',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        allowBlank: false,
        width: 400,
        labelWidth: 180
    } );

    this.paymentStatusCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Payment Status',
        store: this.paymentStatusComboStore,
        name: 'payment_status',
        queryMode: 'local',
        displayField: 'payment_status',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        allowBlank: false,
        labelWidth: 180,
        width: 400
    } );

    this.totalField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Total',
        labelAlign: 'right',
        value: 0,
        width: 400,
        labelWidth: 180,
        allowBlank: false,
        readOnly: true
    } );

    this.frontEndDiscountsTotalField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Front End Discounts Total',
        labelWidth: 180,
        width: 400,
        name: 'front_end_discounts_total',
        allowBlank: true,
        labelAlign: 'right',
        value: 0,
        readOnly: true
    } );

    this.discountField = Ext.create( 'Ext.form.field.Number', {
        fieldLabel: 'Discount (%)',
        labelWidth: 180,
        width: 400,
        name: 'discount',
        allowBlank: true,
        labelAlign: 'right',
        minValue: 0,
        value: 0,
        maxValue: 100,
        allowDecimals: true,
        decimalPrecision: 1,
        step: 0.5,
        listeners: {
            change: function(field, value) {
                var price = this.totalField.getValue() ? this.totalField.getValue() : 0,
                    frontEndDiscountsTotal = this.frontEndDiscountsTotalField.getValue() ? this.frontEndDiscountsTotalField.getValue() : 0;
                this.finalField.setValue( ( price - frontEndDiscountsTotal - price * value / 100 ).toFixed( 2 ) );
            }.bind( this )
        }
    } );

    this.finalField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Final',
        labelAlign: 'right',
        value: 0,
        width: 400,
        labelWidth: 180,
        allowBlank: false,
        readOnly: true
    } );

    // TODO: Redundant with customer database store.
    this.customerNameStore = Ext.create( 'Ext.data.JsonStore', {
        fields:[
            'id',
            'name',
            'email',
            'post_code',
            'address',
            'phone_number',
            'last_login',
            'create_date',
            'verified',
            'order_total'
        ],
        proxy:{
            type:'rest',
            url:'/api/customers/',
            reader:{
                type: 'json',
                root:'data',
                totalProperty: 'total'
            }
        }
    } );

    this.addCustomerButton = Ext.create( 'Ext.button.Button', {
        xtype: 'button'
        ,text: 'Add Customer'
        ,handler: function() { this.createAddCustomerWindow(); }.bind(this)
    } );

    this.editCustomerButton = Ext.create( 'Ext.button.Button', {
        xtype: 'button'
        ,text: 'Edit Customer'
        ,disabled: true
        ,handler: function() {
            this.createAddCustomerWindow(
                this.customerNameField.getValue()
                ,this._selectedCustomer
            );
        }.bind( this )
    } );

    this.viewFrontEndDiscountsButton = Ext.create( 'Ext.button.Button', {
        xtype: 'button'
        ,text: 'View Order Front End Discounts'
        ,disabled: true
        ,handler: function() { if (order) this.createFrontEndDiscountsWindow(order); }.bind(this)
    } );

    this.customerNameField = Ext.create( 'Ext.form.ComboBox', {
        typeAhead: false,
        fieldLabel: 'Customer Name',
        width: 400,
        store: this.customerNameStore,
        labelWidth: 180,
        labelAlign: 'right',
        displayField: 'name',
        valueField: 'id',
        allowBlank: false,
        listConfig: {
            loadingText: 'Searching...',
            emptyText: 'No matching customers found.',
            getInnerTpl: function() {
                return '<div class="search-item">' +
                    'Name: {[Util.textColumnRenderer(values.name)]}<br />' +
                    'Post Code: {[Util.textColumnRenderer(values.post_code)]}<br />' +
                    'Phone Number: {[Util.textColumnRenderer(values.phone_number)]}<br />' +
                    'Email Address: {[Util.textColumnRenderer(values.email)]}<br />' +
                    'Verified: <tpl if="verified === 1">Yes</tpl><tpl if="verified === 0">No</tpl>' +
                    '</div>';
            }
        },
        pageSize: 10,
        // override default onSelect to do redirect
        listeners: {
            select: function(combo, selection) {
                // Store selection, for later use; i.e. when editing the customer details.
                this._selectedCustomer = selection[0].data;

                // Enable editing.
                this.editCustomerButton.setDisabled( false );

                // Populate fields, with row values.
                this.phoneNumberField.setValue( selection[0].data.phone_number );
                this.addressField.setValue( selection[0].data.address );
                this.postCodeField.setValue( selection[0].data.post_code );
                // Set the input field as not 'dirty'.
                this.customerNameField.dirty = false;
            }.bind( this )
            ,change: function() {
                // Set this input field as 'dirty'
                this.customerNameField.dirty = true;
                // Disable editing an existing customer is found.
                this.editCustomerButton.setDisabled( true );
            }.bind( this )
        }
    } );

    this.addressField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Delivery Address',
        width: 400,
        labelWidth: 180,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false
    } );

    this.postCodeField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Post Code',
        width: 400,
        labelWidth: 180,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false
    } );

    this.phoneNumberField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Phone Number',
        width: 400,
        labelWidth: 180,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false
    } );

    this.notesField = Ext.create( 'Ext.form.field.TextArea', {
        fieldLabel: 'Notes',
        labelAlign: 'right',
        width: 400,
        labelWidth: 180
    } );

    // Prepare row editing plugin for updating order item count.
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 0,
        listeners: {
            afteredit: function(editor, context) {
                // First, commit changes to memory.
                context.record.commit();
                // Recalculate prices.
                var price = 0, manualDiscount = this.discountField.getValue() ? this.discountField.getValue() : 0
                    ,frontEndDiscountsTotal = 0
                    ,i
                    ,discount
                    ,menuItems = {};

                this.menuItemsGrid.getStore().each(function(record) {
                    price += record.data.price * record.data.count;
                    if (record.data.count) {
                        menuItems[record.data.id] = record.data;
                    }
                }, this);

                // Calculate front end discounts.
                if (order) {
                    for (i = 0; i < order.front_end_discounts.length; i++) {
                        discount = order.front_end_discounts[i];
                        if (discount.discount_type === 0) {
                            frontEndDiscountsTotal = frontEndDiscountsTotal + (price * discount.discount_value / 100);
                        }

                        if (discount.discount_type === 1
                            && price > discount.discount_value
                            && typeof menuItems[discount.discount_item_id] !== "undefined") {
                            frontEndDiscountsTotal = frontEndDiscountsTotal + menuItems[discount.discount_item_id].price;
                        }
                    }
                }

                this.frontEndDiscountsTotalField.setValue(frontEndDiscountsTotal.toFixed( 2 ));
                this.totalField.setValue( price.toFixed( 2 ) );
                this.finalField.setValue( (price - frontEndDiscountsTotal - price * manualDiscount / 100).toFixed( 2 ) );
            }.bind(this)
        }
    });

    // Create grid.
    this.menuItemsGrid = Ext.create('Ext.grid.Panel', {
        title: 'Food Menu Items',
        height: 300,
        region: 'north',
        plugins: [ rowEditing ],
        frame: false,
        border: false,
        tbar: [  {
            text: 'Refresh',
            type: 'button',
            handler: this.refreshMenuItemData.bind( this )
        }, '->', this.categoryComboSearch, this.foodNameSearchInput, {
            text: 'Search',
            type: 'button',
            handler: this.searchFoodByNameAndCategory.bind( this )
        } ],
        store: this.orderWindowStore,
        columns: [
            { header: 'Count', dataIndex: 'count',field: {
                xtype: 'numberfield',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false,
                step: 1
            } },
            { header: 'Category', dataIndex: 'category_id', renderer: function( value ) {
                var categoryName = "n/a";
                for ( var i = 0; i < Common.FoodMenu.MenuItemCategories.length; i++ ) {
                    if ( Common.FoodMenu.MenuItemCategories[i].id === value ) {
                        categoryName = Common.FoodMenu.MenuItemCategories[i].category_name;
                    }
                }
                return categoryName;
            } },
            { header: 'Name', dataIndex: 'item_name', flex: 1,
                renderer: Util.textColumnRenderer
            },
            { header: 'Number', dataIndex: 'item_number', width: 80 },
            { header: 'Size', dataIndex: 'size_id', renderer: function( value ) {
                var sizeName = "n/a";
                for ( var i = 0; i < Common.FoodMenu.MenuItemSizes.length; i++ ) {
                    if ( Common.FoodMenu.MenuItemSizes[i].id === value ) {
                        sizeName = Common.FoodMenu.MenuItemSizes[i].size_name;
                    }
                }
                return sizeName;
            } },
            { header: 'Price', dataIndex: 'price' }
        ],
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: this.orderWindowStore,
            displayInfo: true,
            displayMsg: 'Displaying food menu items {0} - {1} of {2}',
            emptyMsg: "No items to display"
        } )
    });

    // Create form
    var form = Ext.create( 'Ext.form.Panel', {
        region: 'center',
        bodyPadding: 5,
        frame: false,
        border: false,
        buttons: [{
            text: 'Reset',
            handler: function() {
                form.getForm().reset();
                this.populateWithOrderData();
            }.bind( this )
        }, {
            // TODO: Only allow updating if certain order statuses.
            text: order ? 'Update' : 'Create'
            ,handler: function() {
                if ( form.getForm().isValid() ) {
                    // Prepare Ajax request data
                    var orderItems = []
                        ,url = order ? '/api/order/' + order.id : '/api/order/'
                        ,method = 'POST'
                        ,frontEndDiscounts = []
                        ,i;

                    this.menuItemsGrid.getStore().each(function(record) {
                        if (record.data.count) {
                            orderItems.push( {
                                id: record.data.id
                                ,size_id: record.data.size_id
                                ,count: record.data.count
                            } );
                        }
                    }, this);

                    if (order) {
                        for (i = 0; i < order.front_end_discounts.length; i++) {
                            frontEndDiscounts.push(order.front_end_discounts[i].discount_id);
                        }
                    }

                    this.orderLoadMask = new Ext.LoadMask( window.getEl(), { msg: "Please wait..." } );
                    this.orderLoadMask.show();
                    Ext.Ajax.request({
                        url: url,
                        method: method,
                        params: {
                            items: Ext.JSON.encode(orderItems)
                            ,front_end_discounts: Ext.JSON.encode(frontEndDiscounts)
                            ,delivery_address: this.addressField.getValue()
                            ,post_code: this.postCodeField.getValue()
                            ,notes: this.notesField.getValue()
                            ,order_type: this.orderTypeCombo.getValue()
                            ,payment_status: this.paymentStatusCombo.getValue()
                            ,customer_type: this.customerTypeCombo.getValue()
                            ,customer_phone_number: this.phoneNumberField.getValue()
                            ,customer_name: this.customerNameField.getRawValue()
                            ,customer_id: this.customerNameField.dirty ? "" : this.customerNameField.getValue()
                            ,delivery_type: this.deliveryTypeCombo.getValue()
                            ,discount: this.discountField.getValue()
                            ,reference: this.orderReferenceField.getValue()
                        },
                        success: function(response, opts) {
                            this.orderLoadMask.hide();
                            this.refreshData();
                            window.close();
                        }.bind( this ),
                        failure: function(response, opts) {
                            // TODO: Implement.
                            this.orderLoadMask.hide();
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }.bind( this )
        }],
        autoScroll: true,
        items: [
            this.orderReferenceField
            ,this.orderTypeCombo
            ,this.deliveryTypeCombo
            ,this.customerTypeCombo
            ,this.paymentStatusCombo
            ,this.totalField
            ,{
                xtype: 'fieldset'
                ,border: 0
                ,frame: false
                ,bodyPadding: 0
                ,layout: 'column'
                ,style: 'margin: 0px 0px 0px 0px !important'
                ,bodyStyle: 'margin: 0px 0px 0px 0px !important'
                ,margin: 0
                ,items: [
                    {
                        width: 400
                        ,border: 0
                        ,frame: false
                        ,items: [
                        this.frontEndDiscountsTotalField
                    ]
                    }, {
                        width: 300
                        ,border: 0
                        ,frame: false
                        ,bodyStyle: 'padding-left: 5px;'
                        ,items: [
                            this.viewFrontEndDiscountsButton
                        ]
                    }
                ]
            }
            ,this.discountField
            ,this.finalField
            ,{
                xtype: 'fieldset'
                ,border: 0
                ,frame: false
                ,bodyPadding: 0
                ,layout: 'column'
                ,style: 'margin: 0px 0px 0px 0px !important'
                ,bodyStyle: 'margin: 0px 0px 0px 0px !important'
                ,margin: 0
                ,items: [
                    {
                        width: 400
                        ,border: 0
                        ,frame: false
                        ,items: [
                            this.customerNameField
                        ]
                    }, {
                        width: 110
                        ,border: 0
                        ,frame: false
                        ,bodyStyle: 'padding-left: 5px;'
                        ,items: [
                            this.editCustomerButton
                        ]
                    }, {
                        width: 110
                        ,border: 0
                        ,frame: false
                        ,items: [
                            this.addCustomerButton
                        ]
                    }
                ]
            }
            ,this.phoneNumberField
            ,this.addressField
            ,this.postCodeField
            ,this.notesField
        ]
    } );

    // Create window...
    var window = Ext.create( 'Ext.window.Window', {
        modal: true,
        title: order ? "View order details" : "Create new order",
        height: 690,
        width: 600,
        minWidth: 700,
        layout: 'border',
        maximizable: true,
        maximized: true,
        items: [ this.menuItemsGrid, form ]
    } );

    window.show();
}

/**
 * @function Search orders.
 */
FOBO.ui.prototype.orders.prototype.searchOrders = function() {
    // Reload data.
    this.panel.getStore().load( {
        params: {
            order_type: this.orderTypeSearchCombo.getValue(),
            delivery_type: this.deliveryTypeSearchCombo.getValue(),
            customer_type: this.customerTypeSearchCombo.getValue(),
            payment_status: this.paymentStatusSearchCombo.getValue(),
            customer_name: this.customerNameSearchField.getValue(),
            customer_phone_number: this.phoneNumberSearchField.getValue(),
            reference: this.referenceSearchField.getValue()
        }
    } );
}

/**
 * Method used for accepting an order.
 * @function
 */
FOBO.ui.prototype.orders.prototype.acceptOrder = function() {
    if ( !this.loadMask ) {
        // Create a load mask to be shared.
        this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    }

    // Prepare data.
    var selection = this.panel.getSelectionModel().getSelection()[0],
        order_id = selection.raw.id;

    // TODO: Load default delivery time.
    var deliveryTimeCombo = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: 'Delivery Time (Minutes)',
        displayField: 'time',
        labelWidth: 150,
        allowBlank: false,
        store: Ext.create('Ext.data.Store', {
            fields: [
                {type: 'string', name: 'time'}
            ],
            data: [
                { "time": "10" },
                { "time": "20" },
                { "time": "30" },
                { "time": "40" },
                { "time": "50" },
                { "time": "60" }
            ]
        }),
        editable: false,
        queryMode: 'local'
    });

    var deliveryTimeForm = Ext.create('Ext.form.Panel', {
        items: deliveryTimeCombo,
        border: false,
        frame: false
    });

    var win = Ext.create('Ext.window.Window', {
        title: 'Accept Order: Delivery Time',
        modal: true,
        height: 120,
        width: 350,
        bodyPadding: 5,
        maximizable: false,
        resizable: false,
        items: [ deliveryTimeForm ],
        buttons: [
            {
                text: 'Accept',
                handler: function() {
                    if (deliveryTimeForm.isValid()) {
                        win.hide();
                        Ext.Ajax.request({
                            url: '/api/order/' + order_id + '/accept/',
                            method: 'POST',
                            params: {
                                delivery_time: deliveryTimeCombo.getValue()
                            },
                            success: function(response,opts) {
                                this.refreshData();
                                this.loadMask.hide();
                            }.bind( this )
                            ,failure: function(response, opts) {
                                // TODO: Implement.
                                console.log('server-side failure with status code ' + response.status);
                                this.loadMask.hide();
                            }.bind( this )
                        });
                    }
                }.bind( this )
            },
            {
                text: 'Cancel',
                handler: function() {
                    win.close();
                }.bind( this )
            }
        ]
    });

    win.show();
}

/**
 * Method used for rejecting an order.
 * @function
 */
FOBO.ui.prototype.orders.prototype.rejectOrder = function() {
    if ( !this.loadMask ) {
        // Create a load mask to be shared.
        this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    }

    // Prepare data.
    var selection = this.panel.getSelectionModel().getSelection()[0],
        order_id = selection.raw.id;

    Ext.Msg.show( {
        title:'Reject order?',
        msg: 'Continue order rejection?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.WARNING,
        fn: function( btn ) {
            if ( btn === 'yes' ) {
                this.loadMask.show();
                Ext.Ajax.request({
                    url: '/api/order/' + order_id + '/reject/',
                    method: 'POST',
                    success: function(response,opts) {
                        this.refreshData();
                        this.loadMask.hide();
                    }.bind( this )
                    ,failure: function(response, opts) {
                        // TODO: Implement.
                        console.log('server-side failure with status code ' + response.status);
                        this.loadMask.hide();
                    }.bind( this )
                });
            }
        }.bind( this )
    } );
}

/**
 * Method used for reprinting an order.
 * @function
 */
FOBO.ui.prototype.orders.prototype.reprintOrder = function() {
    if ( !this.loadMask ) {
        // Create a load mask to be shared.
        this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    }

    // Prepare data.
    var selection = this.panel.getSelectionModel().getSelection()[0],
        order_id = selection.raw.id;

    Ext.Msg.show( {
        title:'Reprint order?',
        msg: 'Reprinting an order using the Web Interface will send a customer notification email. If this is not the intention, please use the printer reprint function. Continue?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.WARNING,
        fn: function( btn ) {
            if ( btn === 'yes' ) {
                this.loadMask.show();
                Ext.Ajax.request({
                    url: '/api/order/' + order_id + '/reprint/',
                    method: 'POST',
                    success: function(response,opts) {
                        this.refreshData();
                        this.loadMask.hide();
                    }.bind( this )
                    ,failure: function(response, opts) {
                        // TODO: Implement.
                        console.log('server-side failure with status code ' + response.status);
                        this.loadMask.hide();
                    }.bind( this )
                });
            }
        }.bind( this )
    } );
}

/**
 * Method used for canceling an order.
 * @function
 */
FOBO.ui.prototype.orders.prototype.cancelOrder = function() {
    if ( !this.loadMask ) {
        // Create a load mask to be shared.
        this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    }

    // Prepare data.
    var selection = this.panel.getSelectionModel().getSelection()[0],
        order_id = selection.raw.id;

    Ext.Msg.show( {
        title:'Cancel order?',
        msg: 'Canceling an order can not be reverted. Continue?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.WARNING,
        fn: function( btn ) {
            if ( btn === 'yes' ) {
                this.loadMask.show();
                // Create AJAX request object, cancel the order.
                Ext.Ajax.request({
                    url: '/api/order/' + order_id + '/cancel/',
                    method: 'POST',
                    success: function(response,opts) {
                        this.refreshData();
                        this.loadMask.hide();
                    }.bind( this )
                    ,failure: function(response, opts) {
                        // TODO: Implement.
                        console.log('server-side failure with status code ' + response.status);
                        this.loadMask.hide();
                    }.bind( this )
                });
            }
        }.bind( this )
    } );
}

/**
 * @function Creates google maps window.
 */
FOBO.ui.prototype.orders.prototype.createGoogleMapsWindow = function( postCode ) {
     // Create window...
    var window = Ext.create( 'Ext.window.Window', {
        modal: true,
        title: "Order location and directions",
        height: 690,
        width: 600,
        layout: 'fit',
        maximizable: true,
        maximized: true,
        items: {
            xtype: 'gmappanel',
            zoomLevel: 14,
            gmapType: 'map',
            tbar: [ {
                text: 'Print Directions',
                handler: function() {
                    // TODO: Implement.
                }.bind( this )
            }, {
                text: 'Email Directions',
                handler: function() {
                    // TODO: Implement.
                }.bind( this )
            } ],
            mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
            mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl'],
            setCenter: {
                geoCodeAddr: '20 Palmer Road, Oxford, Oxfordshire, United Kingdom',
                marker: {title: 'Customer Address'}
            },
            markers: [{
                lat: 42.339641,
                lng: -71.094224,
                marker: {title: 'Somewhere else'},
                listeners: {
                    click: function(e){
                        // TODO
                    }
                }
            }]
        }
    } );

    window.show();
}

/**
 * @function Initializes the orders panel and components.
 */
FOBO.ui.prototype.orders.prototype.init = function() {
    // Create store
    this.store = Ext.create( 'Ext.data.JsonStore', {
        fields:[
            'id',
            'reference',
            { name: 'total_price', type: 'double' },
            'delivery_address',
            'item_count',
            'post_code',
            'notes',
            'status',
            'created_by',
            'create_date',
            'customer_type',
            'order_type',
            'payment_status',
            'customer_name',
            'customer_phone_number',
            'printer_message',
            'delivery_type',
            'delivery_time',
            'discount',
            'front_end_discounts_total',
            'final_price'
        ],
        proxy:{
            type:'rest',
            url:'/api/orders/',
            reader:{
                type: 'json',
                root:'data',
                totalProperty: 'total'
            }
        }
    } );

    // Create view details button
    this.viewDetailsButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'View details',
        disabled: true,
        handler: function() {
            var record = this.panel.getSelectionModel().getSelection();
            // Request details, and show window
            Ext.Ajax.request({
                url: '/api/order/' + record[0].raw.id,
                method: "GET",
                success: function(response) {
                    var data;
                    // Check if password update failed.
                    try {
                        data = Ext.decode( response.responseText );

                        this.createNewOrderWindow( data );
                    } catch ( Ex ) {
                        // Do nothing.
                    }
                }.bind( this ),
                failure: function(response) {
                    // TODO: Implement.
                    console.log('server-side failure with status code ' + response.status);
                }
            });
        }.bind( this )
    } );

    // View map directions
    this.viewMapDirectionsButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'View map directions',
        disabled: true,
        handler: function() {
            var record = this.panel.getSelectionModel().getSelection();
            this.createGoogleMapsWindow( record[0].raw.delivery_address );
        }.bind( this )
    } );

    this.cancelOrderButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'Cancel Order',
        disabled: true,
        handler: this.cancelOrder.bind( this )
    } );

    this.reprintOrderButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'Reprint Order',
        disabled: true,
        handler: this.reprintOrder.bind( this )
    } );

    this.acceptOrderButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'Accept Order',
        disabled: true,
        handler: this.acceptOrder.bind( this )
    } );

    this.rejectOrderButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'Reject Order',
        disabled: true,
        handler: this.rejectOrder.bind( this )
    } );

    // Prepare search box stores.
    this.createComboStores();

    // Create search input fields.
    this.orderTypeSearchCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Order Type',
        store: this.orderTypeComboStore,
        name: 'order_type',
        queryMode: 'local',
        displayField: 'order_type',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        labelWidth: 80
    } );

    this.deliveryTypeSearchCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Delivery Type',
        store: this.deliveryTypeComboStore,
        name: 'delivery_type',
        queryMode: 'local',
        displayField: 'delivery_type',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        labelWidth: 80
    } );

    this.customerTypeSearchCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Customer Type',
        store: this.customerTypeComboStore,
        name: 'customer_type',
        queryMode: 'local',
        displayField: 'customer_type',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        labelWidth: 100
    } );

    this.paymentStatusSearchCombo = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Payment Status',
        store: this.paymentStatusComboStore,
        name: 'payment_status',
        queryMode: 'local',
        displayField: 'payment_status',
        valueField: 'id',
        labelAlign: 'right',
        editable: false,
        labelWidth: 100
    } );

    this.customerNameSearchField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Customer Name',
        labelWidth: 180,
        labelAlign: 'right',
        xtype: 'textfield'
    } );

    this.referenceSearchField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Reference',
        labelWidth: 100,
        labelAlign: 'right',
        xtype: 'textfield'
    } );

    this.phoneNumberSearchField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Phone Number',
        labelWidth: 100,
        labelAlign: 'right',
        xtype: 'textfield'
    } );

    // Create grid panel
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Orders',
        store: this.store,
        columns: [
            { header: 'Id', dataIndex: 'id', width: 60 },
            { header: 'Created By', dataIndex: 'created_by', width: 100,
                renderer: Util.textColumnRenderer
            },
            { header: 'Reference', dataIndex: 'reference', width: 100 },
            { header: 'Order Type', dataIndex: 'order_type', width: 90, renderer: function( value ) {
                return Common.OrderConstants._Cached.OrderTypes[value];
            } },
            { header: 'Items', dataIndex: 'item_count', width: 80 },
            { header: 'Total Price', dataIndex: 'total_price', width: 90, renderer: function( value ) {
                if (value) {
                    return value.toFixed( 2 );
                }
                return 0;
            } },
            { header: 'Front End Discount Total', dataIndex: 'front_end_discounts_total', width: 90 },
            { header: 'Discount (%)', dataIndex: 'discount', width: 90 },
            { header: 'Final Price', dataIndex: 'final_price', width: 90, renderer: function( value ) {
                if (value) {
                    return value.toFixed( 2 );
                }
                return 0;
            } },
            { header: 'Delivery Type', dataIndex: 'delivery_type', width: 110, renderer: function( value ) {
                return Common.OrderConstants._Cached.DeliveryTypes[value];
            } },
            { header: 'Customer Type', dataIndex: 'customer_type', width: 110, renderer: function( value ) {
                return Common.OrderConstants._Cached.CustomerTypes[value];
            } },
            { header: 'Payment Status', dataIndex: 'payment_status', width: 120, renderer: function( value ) {
                return Common.OrderConstants._Cached.PaymentStatuses[value];
            } },
            { header: 'Customer Name', dataIndex: 'customer_name', flex: 1,
                renderer: Util.textColumnRenderer
            },
            { header: 'Customer Phone', dataIndex: 'customer_phone_number', width: 150,
                renderer: Util.textColumnRenderer
            },
            { header: 'Create Date', dataIndex: 'create_date', width: 150 },
            { header: 'Delivery Address', dataIndex: 'delivery_address', width: 150,
                renderer: Util.textColumnRenderer
            },
            { header: 'Post Code', dataIndex: 'post_code', width: 50,
                renderer: Util.textColumnRenderer
            },
            { header: 'Status', dataIndex: 'status', width: 80, renderer: function( value ) {
                return Common.OrderConstants._Cached.OrderStatuses[value];
            } },
            { header: 'Delivery Time', dataIndex: 'delivery_time', width: 40, renderer: function( value ) {
                return ( value === "0000-00-00 00:00:00" ) ? "" : value;
            } },
            { header: 'Printer Message', dataIndex: 'printer_message', width: 180,
                renderer: Util.textColumnRenderer
            },
            { header: 'Notes', dataIndex: 'notes', width: 180,
                renderer: Util.textColumnRenderer
            }
        ],
        listeners: {
            itemclick: function( grid, record, item, index, e, eOpts ) {
                this.viewDetailsButton.setDisabled( false );
                this.viewMapDirectionsButton.setDisabled( false );

                if ( record.data.status === 0 || record.data.status === 1 || record.data.status === 99 ) {
                    this.cancelOrderButton.setDisabled( false );
                } else {
                    this.cancelOrderButton.setDisabled( true );
                }

                if (record.data.status === 0) {
                    this.acceptOrderButton.setDisabled(false);
                    this.rejectOrderButton.setDisabled(false);
                } else {
                    this.acceptOrderButton.setDisabled(true);
                    this.rejectOrderButton.setDisabled(true);
                }

                if (record.data.order_type === 1 || record.data.order_type === 2 || record.data.order_type === 3) {
                    this.reprintOrderButton.setDisabled(false);
                } else {
                    this.reprintOrderButton.setDisabled(true);
                }
            }.bind( this )
        },
        dockedItems: [
            {
                xtype: 'toolbar',
                docked: 'top',
                // TODO: Enable directions button: , this.viewMapDirectionsButton
                items: [ this.viewDetailsButton, {
                    type: 'button',
                    text: 'Create new order',
                    handler: function() { this.createNewOrderWindow(); }.bind( this )
                }, {
                    text: 'Refresh',
                    type: 'button',
                    handler: this.refreshData.bind( this )
                }, this.cancelOrderButton
                    , this.reprintOrderButton
                    , this.acceptOrderButton
                    , this.rejectOrderButton
                ]
            },
            {
                xtype: 'toolbar'
                ,items: [ this.orderTypeSearchCombo, this.deliveryTypeSearchCombo, this.customerTypeSearchCombo, this.paymentStatusSearchCombo ]
            },
            {
                xtype: 'toolbar'
                ,items: [ this.customerNameSearchField, this.phoneNumberSearchField, this.referenceSearchField, {
                    xtype: 'button'
                    ,text: 'Search'
                    ,handler: this.searchOrders.bind( this )
                } ]
            }
        ],
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Displaying orders {0} - {1} of {2}',
            emptyMsg: "No items to display"
        } )
    });
}