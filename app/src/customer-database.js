/**
 * @fileOverview Holds the customer database panel and components.
 */

/**
 * @constructors Class constructor.
 */
FOBO.ui.prototype.customerDatabase = function() {
    // Prepare related items.
    this.createStore();

    this.init();
};

/**
 * @function Method used for creating the grid store.
 */
FOBO.ui.prototype.customerDatabase.prototype.createStore = function() {
    this.store = Ext.create( 'Ext.data.JsonStore', {
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
                root:'items'
            }
        }
    } );
}

/**
 * @function Reloads the main grid panel data.
 */
FOBO.ui.prototype.customerDatabase.prototype.refreshData = function() {
    // Reload data.
    this.panel.getStore().load();
}

/**
 * @function Initializes this component.
 */
FOBO.ui.prototype.customerDatabase.prototype.init = function() {
    // Create view details button
    this.verifyButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'Verify',
        disabled: true,
        handler: function() {
            var selection = this.panel.getView().getSelectionModel().getSelection();

            if ( selection.length === 1 ) {
                Ext.Ajax.request({
                    url: "/api/customer/verify/" + selection[0].raw.id + "/" + ( selection[0].raw.verified === 1 ? 0 : 1 ),
                    method: "PUT",
                    success: function(response, opts) {
                        this.refreshData();
                        this.panel.getView().getSelectionModel().deselectAll();
                        this.verifyButton.setDisabled( true );
                        this.verifyButton.setText( 'Verify' );
                    }.bind( this ),
                    failure: function(response, opts) {
                        // TODO: Implement.
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }
        }.bind( this )
    } );

    // TODO: Add an orders window.
    this.ordersButton = Ext.create( 'Ext.button.Button', {
        type: 'button',
        text: 'View Orders',
        disabled: true
    } );

    // Create grid panel
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Customer Database',
        store: this.store,
        columns: [
            { header: 'Name', dataIndex: 'name', flex: 1 },
            { header: 'Email Address', dataIndex: 'email', width: 180 },
            { header: 'Post Code', dataIndex: 'post_code', width: 180 },
            { header: 'Address', dataIndex: 'address', width: 200 },
            { header: 'Phone Number', dataIndex: 'phone_number', width: 140 },
            { header: 'Last Login', dataIndex: 'last_login', width: 120, renderer: Ext.util.Format.dateRenderer('d/m/Y H:i') },
            { header: 'Create Date', dataIndex: 'create_date', width: 120, renderer: Ext.util.Format.dateRenderer('d/m/Y H:i') },
            { header: 'Verified', dataIndex: 'verified', width: 100, renderer: function( value ) {
                return value === 1 ? "Yes" : "No";
            } },
            { header: 'Order Total', dataIndex: 'order_total', width: 100 }
        ],
        tbar: {
            // TODO: Add view orders: this.ordersButton.
            items: [ this.verifyButton, {
                text: 'Refresh',
                type: 'button',
                handler: this.refreshData.bind( this )
            } ]
        },
        listeners: {
            itemclick: function( grid, record, item, index, e, eOpts ) {
                this.verifyButton.setDisabled( false );
                if ( record.data.verified === 1 ) {
                    this.verifyButton.setText( "Unverify" );
                } else {
                    this.verifyButton.setText( "Verify" );
                }
                this.ordersButton.setDisabled( false );
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