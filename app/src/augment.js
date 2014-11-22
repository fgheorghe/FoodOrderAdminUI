/**
 * @fileOverview Overrides default Ext functionality.
 */

// Override the connection object, to figure out when a connection is made.
// If a JSON object with properties success: false and reason: -1 is returned, then
// the user session has expired, and must re-login.

// Store the original function.
Ext.data.Connection.prototype._onComplete = Ext.data.Connection.prototype.onComplete;

Ext.data.Connection.prototype.onComplete = function( request, xdrResult ) {
    // Try and decode data.
    var data
        ,response = this._onComplete( request, xdrResult );
    try {
        data = Ext.decode( response.responseText );
    } catch ( Ex ) {
        // Do nothing.
    }

    if ( typeof data !== "undefined" && typeof data.success !== "undefined" && data.success === false && typeof data.reason !== "undefined" && data.reason === -1 ) {
        // Notify the user, and show the login form.
        Ext.Msg.show( {
            title:'Session expired',
            msg: 'Your session has expired. Please login.',
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR,
            fn: function() {
                // Reload page.
                window.location.reload();
            }
        });

        return {}; // Return an empty object.
    }

    // Return response as is.
    return response;
}