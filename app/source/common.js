/**
 * @fileOverview Holds common variables / constants. Caches some for later use.
 */

/**
 * @namespace Common variables namespace.
 */
var Common = {
    Image: {
        Types: [
            { id: 0, type_name: 'None' },
            { id: 1, type_name: 'Logo' },
            { id: 2, type_name: 'Fact 1' },
            { id: 3, type_name: 'Fact 2' },
            { id: 4, type_name: 'Fact 3' }
        ]
    },
    FoodMenu: {
        // TODO: Load from database, and add proper types.
        // From table menu_item_sizes, used by combo stores.
        MenuItemSizes: [
            { id: 1, size_name: "Small" },
            { id: 2, size_name: "Large" },
            { id: 3, size_name: "Medium" },
            { id: 4, size_name: "Family" },
            { id: 5, size_name: "0.33 Can" }
        ],
        // From table menu_item_types, populated by the login object.
        // id, category_name
        MenuItemCategories: []
    },
    // User related constants.
    Users: {
        // User roles.
        Roles: [
            { id: 2, role_name: "Delivery" },
            { id: 3, role_name: "Administrator" },
            { id: 4, role_name: "Chef" }
        ]
    },
    // Order constants
    OrderConstants: {
        // Used by combo stores
        PaymentStatuses: [
            { id: 6, payment_status: "Paid" },
            { id: 7, payment_status: "Not Paid" }
        ],
        OrderTypes: [
            { id: 0, order_type: "Offline" },
            { id: 1, order_type: "Online" },
            { id: 2, order_type: "Phone" },
            { id: 3, order_type: "Table" }
        ],
        DeliveryTypes: [
            { id: 1, delivery_type: "Delivery" },
            { id: 2, delivery_type: "Collection" }
        ],
        CustomerTypes: [
            { id: 4, customer_type: "Verified" },
            { id: 5, customer_type: "Not Verified" }
        ],
        // Used only by rendereres
        OrderStatuses: [
            { id: 0, status: "Pending" },
            { id: 1, status: "Printer" },
            { id: 2, status: "Accepted" },
            { id: 3, status: "Rejected" },
            { id: 99, status: "Error" }
        ]
    }
};

/** Cache some of the common values, for use by renderers **/

// Cache order constants
Common.OrderConstants._Cached = {};
_.each( Common.OrderConstants, function( value, key ) {
    // Prepare cache object
    Common.OrderConstants._Cached[key] = {};
    // And cache its items
    _.each( value, function( _value, _key ) {
        Common.OrderConstants._Cached[key][_value.id] = _value.payment_status || _value.order_type || _value.customer_type || _value.status || _value.delivery_type || _value.order_type;
    } );
} );

// Cache user roles.
Common.Users._Cached = {};
_.each( Common.Users, function( value, key ) {
    // Prepare cache object
    Common.Users._Cached[key] = {};
    // And cache its items
    _.each( value, function( _value, _key ) {
        Common.Users._Cached[key][_value.id] = _value.role_name;
    } );
} );

// Cache image types.
Common.Image._Cached = {};
_.each( Common.Image, function( value, key ) {
    // Prepare cache object
    Common.Image._Cached[key] = {};
    // And cache its items
    _.each( value, function( _value, _key ) {
        Common.Image._Cached[key][_value.id] = _value.type_name;
    } );
} );