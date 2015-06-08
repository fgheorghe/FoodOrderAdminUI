/**
 * @fileOverview Hosts the payment settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.SMSNotificationSettings = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.SMSNotificationSettings.prototype.init = function() {
    // Form panel, hosting input fields.
    this.form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        bodyPadding: 5,
        items: [ {
            fieldLabel: 'SMS Gateway Username',
            name: 'sms_gateway_username',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 240
        }, {
            fieldLabel: 'SMS Gateway Password',
            name: 'sms_gateway_password',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 240
        }, {
            fieldLabel: 'SMS Recepient',
            name: 'sms_order_notification_recipient',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            labelWidth: 240
        }, {
            xtype: 'checkboxfield',
            fieldLabel: 'Enable SMS Notifications',
            labelAlign: 'right',
            labelWidth: 240,
            tabIndex: 4,
            name: "enable_sms_notifications_on_online_orders"
        } ]
        ,buttons: [ {
            text: 'Reset',
            handler: function() {
                this.loadSettings();
            }.bind( this )
        }, {
            text: 'Submit',
            tabIndex: 5,
            handler: function() {
                this.submitFormData();
            }.bind( this )
        } ]
    } );

    // Panel itself.
    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: "SMS Notification Settings"
        ,items: [ this.form ]
        ,layout: 'fit'
        ,listeners: {
            render: this.loadSettings.bind( this )
        }
    } );
}

FOBO.ui.prototype.SMSNotificationSettings.prototype.loadSettings = function() {
    // Create a load mask, to let the user know
    // that we are fetching data.
    this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    // Show - and hide once AJAX data is returned.
    this.loadMask.show();

    // Trigger an AJAX call for loading form values.
    this.fetchSettings();
}

FOBO.ui.prototype.SMSNotificationSettings.prototype.fetchSettings = function() {
    // Create AJAX request object, and get form data.
    Ext.Ajax.request({
        url: '/api/sms-notification-settings/',
        success: function(response){
            var data;

            // Populate the form, with data...if any.
            try {
                data = Ext.decode( response.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            if ( data ) {
                this.form.getForm().findField( 'sms_gateway_password').setValue( data.sms_gateway_password );
                this.form.getForm().findField( 'sms_gateway_username').setValue( data.sms_gateway_username );
                this.form.getForm().findField( 'enable_sms_notifications_on_online_orders').setValue( data.enable_sms_notifications_on_online_orders );
                this.form.getForm().findField( 'sms_order_notification_recipient').setValue( data.sms_order_notification_recipient );
            }

            // Hide the load mask.
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}

FOBO.ui.prototype.SMSNotificationSettings.prototype.submitFormData = function() {
    this.loadMask.show();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/sms-notification-settings/',
        method: 'POST',
        params: {
            sms_gateway_password: this.form.getForm().findField( 'sms_gateway_password').getValue(),
            sms_gateway_username: this.form.getForm().findField( 'sms_gateway_username').getValue(),
	    sms_order_notification_recipient: this.form.getForm().findField('sms_order_notification_recipient').getValue(),
            enable_sms_notifications_on_online_orders: this.form.getForm().findField( 'enable_sms_notifications_on_online_orders').getValue() ? 1 : 0
        },
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}
