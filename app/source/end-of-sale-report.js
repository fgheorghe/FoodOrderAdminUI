/**
 * @fileOverview Hosts the end of sale report panel logic and ui components.
 */

/**
 * @constructor Constructor for the eosr class.
 */
FOBO.ui.prototype.eosr = function() {
    this.init();
};

/**
 * @function Reloads the main grid panel data.
 */
FOBO.ui.prototype.eosr.prototype.refreshData = function() {
    // Reload data.
    this.panel.getStore().load();
}

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.eosr.prototype.init = function() {
    // Create store.
    this.store = Ext.create( 'Ext.data.JsonStore', {
        fields:[
            'id',
            { name: 'total_price', type: 'double' },
            'delivery_address',
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
            'final_price'
        ],
        proxy:{
            type:'rest',
            url:'/api/orders/',
            reader:{
                type: 'json',
                root:'data',
            },
            filterParam: undefined,
            groupParam: undefined,
            pageParam: undefined,
            startParam: undefined,
            sortParam: undefined,
            limitParam: undefined,
            extraParams: {
                interval: 'today'
            }
        },
        groupField: 'status'
    } );

    // Create grid.
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'End of Sale Report',
        iconCls: 'icon-grid',
        store: this.store,
        features: [{
            id: 'group',
            ftype: 'groupingsummary',
            groupHeaderTpl:  Ext.create( 'Ext.XTemplate',
                'Order status: ',
                '<b>{name:this.formatStatus}</b>',
                {
                    formatStatus: function(status) {
                        return Common.OrderConstants._Cached.OrderStatuses[status];
                    }
                }
            ),
            hideGroupedHeader: true,
            enableGroupingMenu: false
        }],
        // TODO: Fix parse int to float!
        columns: [
            { header: 'Created By', dataIndex: 'created_by', width: 100,
                renderer: Util.textColumnRenderer
            },
            { header: 'Total Price', dataIndex: 'total_price', width: 90, renderer: function( value ) {
                if (value) {
                    return parseInt( value, 10).toFixed( 2 );
                }
                return 0;
            } },
            { header: 'Discount (%)', dataIndex: 'discount', width: 90 },
            { header: 'Final Price', dataIndex: 'final_price', width: 90, renderer: function( value ) {
                if (value) {
                    return parseInt( value, 10).toFixed( 2 );
                }
                return 0;
            }, summaryType: 'sum', summaryRenderer: function(value) { return value.toFixed( 2 ) } },
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
            { header: 'Delivery Time', dataIndex: 'delivery_time', width: 40, renderer: function( value ) {
                return ( value === "0000-00-00 00:00:00" ) ? "" : value;
            } },{ header: 'Printer Message', dataIndex: 'printer_message', width: 180,
                renderer: Util.textColumnRenderer
            },
            { header: 'Notes', dataIndex: 'notes', width: 180,
                renderer: Util.textColumnRenderer
            }
        ],
        dockedItems: [
            {
                xtype: 'toolbar',
                docked: 'top',
                items: [ {
                    text: 'Refresh',
                    type: 'button',
                    handler: this.refreshData.bind( this )
                } ]
            }
         ]
    } );
}