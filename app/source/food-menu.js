/**
 * @fileOverview Holds food menu panel and components.
 */

/**
 * @constructor Constructor for the food menu class.
 */
FOBO.ui.prototype.foodMenu = function() {
    this.init();
};

/**
 * @function Initializes the food menu components.
 */
FOBO.ui.prototype.foodMenu.prototype.init = function() {
    this.createComboStores();
    this.createPanel();
};

/**
 * @function Creates the category, type and size combo stores.
 */
FOBO.ui.prototype.foodMenu.prototype.createComboStores = function() {
    this.categoryComboStore = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'category_name' ],
        data : Common.FoodMenu.MenuItemCategories
    } );
    this.sizeComboStore = Ext.create('Ext.data.Store', {
        fields: [ 'id', 'size_name' ],
        data : Common.FoodMenu.MenuItemSizes
    } );
};

/**
 * @function Creates the main grip panel store.
 */
FOBO.ui.prototype.foodMenu.prototype.createStore = function() {
    this.store = Ext.create( 'Ext.data.JsonStore', {
        fields:[ 'id', { name: 'category_id', type: 'int' }, 'item_description', 'item_name', 'item_number', 'size_id', 'price' ],
        proxy:{
            type:'rest',
            url:'/api/menu-items/',
            reader:{
                type: 'json',
                root: 'data'
            }
        }
    } );
}

/**
 * @function Creates and shows a new item window.
 */
FOBO.ui.prototype.foodMenu.prototype.createNewItemWindow = function() {
    var form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        items: [ Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Category',
            store: this.categoryComboStore,
            name: 'category_id',
            queryMode: 'local',
            displayField: 'category_name',
            valueField: 'id',
            labelAlign: 'right',
            editable: false,
            allowBlank: false,
            tabIndex: 1
        } ), {
            fieldLabel: 'Number',
            name: 'item_number',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2
        }, {
            fieldLabel: 'Name',
            name: 'item_name',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2
        }, Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Size',
            name: 'size_id',
            store: this.sizeComboStore,
            queryMode: 'local',
            displayField: 'size_name',
            valueField: 'id',
            labelAlign: 'right',
            editable: false,
            allowBlank: false,
            tabIndex: 3
        } ), {
            fieldLabel: 'Price',
            name: 'price',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 4
        }, Ext.create( 'Ext.form.field.TextArea', {
            fieldLabel: 'Description',
            labelAlign: 'right',
            width: 400,
            name: 'item_description',
            tabIndex: 5
        } ) ]
    } );

    // Create the window and its form
    var window = Ext.create('Ext.window.Window', {
        title: 'Add New Food Menu Item',
        modal: true,
        height: 300,
        width: 430,
        bodyPadding: 5,
        layout: 'fit',
        items: [ form ],
        buttons: [{
            text: 'Reset',
            handler: function() {
                form.getForm().reset();
            }
        }, {
            text: 'Submit',
            tabIndex: 5,
            handler: function() {
                var menuItem;
                if ( form.getForm().isValid() ) {
                    this.addMenuItemLoadMask = new Ext.LoadMask( window.getEl(), { msg: "Please wait..." } );
                    this.addMenuItemLoadMask.show();
                    // Prepare Ajax request data
                    menuItem = {
                        category_id: form.getForm().findField( 'category_id' ).getValue(),
                        item_name: form.getForm().findField( 'item_name' ).getValue(),
                        item_description: form.getForm().findField( 'item_description' ).getValue(),
                        size_id: form.getForm().findField( 'size_id' ).getValue(),
                        price: form.getForm().findField( 'price' ).getValue(),
                        item_number: form.getForm().findField( 'item_number' ).getValue()
                    };

                    Ext.Ajax.request({
                        url: '/api/menu-item/',
                        method: "POST",
                        params: menuItem,
                        success: function(response, opts) {
                            this.addMenuItemLoadMask.hide();
                            this.refreshData();
                            window.close();
                        }.bind( this ),
                        failure: function(response, opts) {
                            this.addMenuItemLoadMask.hide();
                            // TODO: Implement.
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }.bind( this )
        }]
    } );

    window.show();
}

/**
 * @function Removes an item, by making an Ajax call.
 */
FOBO.ui.prototype.foodMenu.prototype.removeItem = function() {
    var selection = this.panel.getView().getSelectionModel().getSelection();

    if ( selection.length === 1 ) {
        // TODO: Clean-up.
        Ext.Ajax.request({
            url: '/api/menu-item/' + selection[0].raw.id,
            method: "DELETE",
            success: function(response, opts) {
                this.refreshData();
            }.bind( this ),
            failure: function(response, opts) {
                // TODO: Implement.
                console.log('server-side failure with status code ' + response.status);
            }
        });

        this.removeItemButtom.setDisabled( true );
    }
}

/**
 * @function Search button handler.
 */
FOBO.ui.prototype.foodMenu.prototype.searchFoodByNameAndCategory = function() {
    // Reload panel data.
    this.panel.getStore().load( {
        params: {
            category_id: this.categoryComboSearch.getValue(),
            item_name: this.foodNameSearchInput.getValue()
        }
    } );
}

/**
 * @function Reloads the main grid panel data.
 */
FOBO.ui.prototype.foodMenu.prototype.refreshData = function() {
    // Re-set search fields
    this.categoryComboSearch.clearValue();
    this.foodNameSearchInput.setValue();

    // Reload panel data.
    this.panel.getStore().load();
}

/**
 * @function Creates the main panel.
 */
FOBO.ui.prototype.foodMenu.prototype.createPanel = function() {
    // Create store
    this.createStore();

    // Prepare input fields
    this.foodNameSearchInput = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Name',
        width: 250,
        labelWidth: 50,
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

    // Prepare row editing plugin
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        listeners: {
            edit: function( editor, event ) {
                var menuItem = {
                    category_id: event.record.data.category_id,
                    item_name: event.record.data.item_name,
                    price: event.record.data.price,
                    size_id: event.record.data.size_id,
                    item_number: event.record.data.item_number,
                    item_description: event.record.data.item_description
                };

                // TODO: Clean-up.
                Ext.Ajax.request({
                    url: '/api/menu-item/' + event.record.raw.id,
                    method: "POST",
                    params: menuItem,
                    success: function(response, opts) {
                        this.refreshData();
                        window.close();
                    }.bind( this ),
                    failure: function(response, opts) {
                        // TODO: Implement.
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }.bind( this )
        }
    });

    this.removeItemButtom = Ext.create( 'Ext.button.Button', {
        text: 'Remove Item',
        handler: this.removeItem.bind( this ),
        disabled: true
    });

    // Create grid panel
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Food Menu',
        store: this.store,
        plugins: [ rowEditing ],
        columns: [
            { header: 'Category',field: {
                xtype: 'combo',
                store: this.categoryComboStore,
                name: 'category_id',
                queryMode: 'local',
                displayField: 'category_name',
                valueField: 'id',
                labelAlign: 'right',
                editable: false,
                allowBlank: false
            },  dataIndex: 'category_id', flex: 1, renderer: function( value ) {
                for ( var i = 0; i < Common.FoodMenu.MenuItemCategories.length; i++ ) {
                    if ( Common.FoodMenu.MenuItemCategories[i].id === value ) {
                        return Common.FoodMenu.MenuItemCategories[i].category_name;
                    }
                }
                return "n/a";
            } },
            { header: 'Number',field: { xtype: 'textfield' },  dataIndex: 'item_number', width: 80 },
            { header: 'Name',field: { xtype: 'textfield' },  dataIndex: 'item_name', flex: 1,
                renderer: Util.textColumnRenderer
            },
            { header: 'Size', dataIndex: 'size_id', field: {
                xtype: 'combo',
                name: 'size_id',
                store: this.sizeComboStore,
                queryMode: 'local',
                displayField: 'size_name',
                valueField: 'id',
                labelAlign: 'right',
                editable: false,
                allowBlank: false
            }, renderer: function( value ) {
                for ( var i = 0; i < Common.FoodMenu.MenuItemSizes.length; i++ ) {
                    if ( Common.FoodMenu.MenuItemSizes[i].id === value ) {
                        return Common.FoodMenu.MenuItemSizes[i].size_name;
                    }
                }
                return "n/a";
            } },
            { header: 'Price', dataIndex: 'price', field: { xtype: 'numberfield', value: 1, minValue: 1 } },
            { header: 'Description',field: { xtype: 'textfield' },  dataIndex: 'item_description', width: 150,
                renderer: Util.textColumnRenderer
            }
        ],
        tbar: {
            items: [ {
                type: 'button',
                text: 'Add Item',
                handler: this.createNewItemWindow.bind( this )
            }, this.removeItemButtom, {
                text: 'Refresh',
                type: 'button',
                handler: this.refreshData.bind( this )
            }, '->', this.categoryComboSearch, this.foodNameSearchInput, {
                text: 'Search',
                type: 'button',
                handler: this.searchFoodByNameAndCategory.bind( this )
            } ]
        },
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Displaying food menu items {0} - {1} of {2}',
            emptyMsg: "No items to display"
        } ),
        listeners: {
            itemclick: function( grid, record, item, index, e, eOpts ) {
                this.removeItemButtom.setDisabled( false );
            }.bind( this )
        }
    });
}