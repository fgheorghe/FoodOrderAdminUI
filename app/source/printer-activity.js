/**
 * @fileOverview Holds the printer activity log panel and components.
 */
// TODO: Rename to Printer Activity Log!

/**
 * @constructors Class constructor.
 */
FOBO.ui.prototype.printerActivity = function() {
    this.init();
};

/**
 * @function Reloads main panel data.
 */
FOBO.ui.prototype.printerActivity.prototype.refreshData = function() {
    this.panel.getStore().load();
}

/**
 * @function Creates data store for the main grid panel.
 */
FOBO.ui.prototype.printerActivity.prototype.createStore = function() {
    this.store = Ext.create( 'Ext.data.JsonStore', {
        fields:[ 'id', { name: 'date_time', type: 'date' }, 'printer_identifier', 'ip_address', 'requested_service_name', 'request_data' ],
        proxy:{
            type:'rest',
            url:'/api/printer-activity/',
            reader:{
                type: 'json',
                root:'data'
            }
        }
    } );
}

/**
 * @function Initializes this component.
 */
FOBO.ui.prototype.printerActivity.prototype.init = function() {
    this.createStore();

    // Create grid panel
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Printer Activity',
        store: this.store,
        columns: [
            { header: 'Identifier', dataIndex: 'printer_identifier', width: 180,
                renderer: Util.textColumnRenderer
            },
            { header: 'Date Time', dataIndex: 'date_time', width: 350 },
            { header: 'IP Address', dataIndex: 'ip_address', flex: 1 },
            { header: 'Requested Service', dataIndex: 'requested_service_name', width: 180 },
            { header: 'Request Data', dataIndex: 'request_data', width: 180,
                renderer: Util.textColumnRenderer
            }
        ],
        tbar: {
            items: [ {
                text: 'Refresh',
                type: 'button',
                handler: this.refreshData.bind( this )
            } ]
        },
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Displaying log entries {0} - {1} of {2}',
            emptyMsg: "No items to display"
        } )
    } );
}