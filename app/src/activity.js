/**
 * @fileOverview Holds the printer activity log panel and components.
 */
// TODO: Rename to Printer Activity Log!

/**
 * @constructors Class constructor.
 */
FOBO.ui.prototype.activity = function() {
    this.init();
};

/**
 * @function Reloads main panel data.
 */
FOBO.ui.prototype.activity.prototype.refreshData = function() {
    this.panel.getStore().load();
}

/**
 * @function Creates data store for the main grid panel.
 */
FOBO.ui.prototype.activity.prototype.createStore = function() {
    this.store = Ext.create( 'Ext.data.JsonStore', {
        fields:[ 'id', { name: 'date_time', type: 'date' }, 'ip_address', 'requested_service_name', 'request_data' ],
        proxy:{
            type:'rest',
            url:'/api/activity/',
            reader:{
                type: 'json',
                root:'items'
            }
        }
    } );
}

/**
 * @function Initializes this component.
 */
FOBO.ui.prototype.activity.prototype.init = function() {
    this.createStore();

    // Create grid panel
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Activity',
        store: this.store,
        columns: [
            { header: 'Date Time', dataIndex: 'date_time', width: 350 },
            { header: 'IP Address', dataIndex: 'ip_address', flex: 1 },
            { header: 'Requested Service', dataIndex: 'requested_service_name', width: 180 },
            { header: 'Request Data', dataIndex: 'request_data', width: 180 }
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
            displayMsg: 'Displaying topics {0} - {1} of {2}',
            emptyMsg: "No items to display"
        } )
    } );
}