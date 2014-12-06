/**
 * @fileOverview Provides the main user interface namespace, and functionality.
 */

/**
 * @namespace Holds ui logic.
 */
FOBO.ui = function() {};

// Caches components
FOBO.ui.prototype.components = {};

/**
 * @function Creates main ui layout: menu, center and west panel.
 */
FOBO.ui.prototype.init = function() {
    // Create menu and center panels
    this.createMenuPanel();
    this.createWestPanel();
    this.createCenterPanel();

    // Create viewport
    this.createViewport();
}

/**
 * @function Creates the navigation menu item.
 */
FOBO.ui.prototype.createWestPanel = function() {
    // Create panel used for hosting navigation items
    this.westPanel = Ext.create( 'Ext.panel.Panel', {
        region: "west",
        layout: 'fit',
        title: "Navigation",
        collapsible: true,
        items: [ this.menuPanel ]
    } );
}

/**
 * Logs the user out, by issuing a B/E logout request, and reloading the page.
 */
FOBO.ui.prototype.doLogout = function() {
    // Create a user friendly load mask.
    this.loadMask = new Ext.LoadMask( Ext.getBody(), { msg:"Logging out..."} );
    this.loadMask.show();
    // Request a log out.
    Ext.Ajax.request({
        url: '/api/logout/',
        method: "GET",
        success: function(response, opts) {
            // And reload the page...
            window.location.reload();
        }.bind( this ),
        failure: function(response, opts) {
            // TODO: Implement.
            console.log('server-side failure with status code ' + response.status);
        }
    });
}

/**
 * Treenode click event handler. Loads different panels for each menu item.
 * NOTE: Each node must have a "role" property, based on which the relevant panel is loaded.
 * NOTE: The panel name must be identical to the role name.
 * @param panel
 * @param record
 * @param index
 * @param e
 * @param eOpts
 */
FOBO.ui.prototype.treeNodeClickHandler = function( panel, record, index, e, eOpts ) {
    // Store panel name
    var componentName = false;
    switch ( record.raw.role ) {
        case "dashboard":
            componentName = "dashboard";
            break;
        case "food-menu":
            componentName = "foodMenu";
            break;
        case "restaurant-settings":
            componentName = "restaurantSettings";
            break;
        case "front-end-settings":
            componentName = "frontEndSettings";
            break;
        case "printer-activity":
            componentName = "printerActivity";
            break;
        case "orders":
            componentName = "orders";
            break;
        case "customer-database":
            componentName = "customerDatabase";
            break;
        case "users":
            componentName = "users";
            break;
        case "eosr":
            componentName = "eosr";
            break;
        case "change-password":
            componentName = "changePassword";
            break;
        case "logout":
            this.doLogout();
            // Stop execution, this button is handled localy.
            return;
            break;
    }

    if ( componentName && !this.components[ componentName ] ) {
        this.components[ componentName ] = new this[ componentName ]();
        this.centerPanel.add( this.components[ componentName ].panel );
    }

    // Load panel.
    this.centerPanel.getLayout().setActiveItem( this.components[ componentName ].panel );

    // Reload data, if a refresh method is available.
    if ( typeof this.components[ componentName ].refreshData !== "undefined" ) {
        this.components[ componentName ].refreshData();
    }
}

/**
 * @function Creates the menu panel.
 */
FOBO.ui.prototype.createMenuPanel = function() {
    // Prepare menu items
    var store = Ext.create('Ext.data.TreeStore', {
        root: {
            expanded: true,
            children: [{
                text: "Dashboard",
                role: 'dashboard',
                leaf: true
            }, {
                text: "Food Menu",
                role: 'food-menu',
                leaf: true
            }, {
                text: "Orders",
                role: 'orders',
                leaf: true
            }, {
                text: "Customer Database",
                role: 'customer-database',
                leaf: true
            }, {
                text: "End of Sale Report",
                role: 'eosr',
                leaf: true
            }, {
                text: "Printer Activity",
                role: 'printer-activity',
                leaf: true
            }, {
                text: "Settings",
                expanded: true,
                children: [
                    {
                        text: "Restaurant",
                        role: 'restaurant-settings',
                        leaf: true
                    }, {
                        text: "Front-End",
                        role: 'front-end-settings',
                        leaf: true
                    }, {
                        text: "Printer",
                        role: 'printer-settings',
                        leaf: true
                    }, {
                        text: "Access Token",
                        role: 'access-token-settings',
                        leaf: true
                    }
                ]
            }, {
                text: "Users",
                role: 'users',
                leaf: true
            }, {
                text: "Change Password",
                role: 'change-password',
                leaf: true
            }, {
                text: 'Logout',
                role: 'logout',
                leaf: true
            } ]
        }
    });

    // Create tree panel
    this.menuPanel = Ext.create('Ext.tree.Panel', {
        width: 200,
        store: store,
        border: false,
        frame: false,
        rootVisible: false,
        listeners: {
            itemclick: this.treeNodeClickHandler.bind( this )
        }
    } );
}

/**
 * @function Creates the center panel, used for hosting panels for each menu item.
 */
FOBO.ui.prototype.createCenterPanel = function() {
    // Create the dashboard component.
    this.components[ 'dashboard' ] = new this[ "dashboard" ]();

    // Create center panel, used for storing actual "pages"
    this.centerPanel = Ext.create( 'Ext.panel.Panel', {
        region: "center",
        layout: 'card',
        activeItem: 0,
        items: [ this.components[ 'dashboard' ].panel ]
    } );
}

/**
 * @function Creates the viewport hosting all ui conponents.
 */
FOBO.ui.prototype.createViewport = function() {
    // Create view port, used for generating the main page layout
    this.viewPort = Ext.create( 'Ext.Viewport', {
        title: "FoodOrder Backoffice",
        layout: 'border',
        items: [ this.westPanel, this.centerPanel ]
    } );
}