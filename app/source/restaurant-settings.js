/**
 * @fileOverview Hosts the settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.restaurantSettings = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.restaurantSettings.prototype.init = function() {
    // Form panel, hosting input fields.
    this.form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        bodyPadding: 5,
        items: [ {
            fieldLabel: 'Restaurant Name',
            name: 'restaurant_name',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 250
        }, {
            fieldLabel: 'Restaurant Post Code',
            name: 'restaurant_post_code',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 250
        }, {
            fieldLabel: 'Default Delivery Time (minutes)',
            labelWidth: 250,
            name: 'default_delivery_time',
            xtype: 'numberfield',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            minValue: 10,
            allowDecimals: false,
            step: 1
        }, {
            fieldLabel: 'Default Collection Time (minutes)',
            labelWidth: 250,
            name: 'default_collection_time',
            xtype: 'numberfield',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            minValue: 10,
            allowDecimals: false,
            step: 1
        }, {
            fieldLabel: 'Minimum Website Delivery Order Value',
            labelWidth: 250,
            name: 'minimum_website_order_value',
            xtype: 'numberfield',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            minValue: 0,
            allowDecimals: false,
            step: 1
        }, {
            fieldLabel: 'Delivery Range (miles)',
            labelWidth: 250,
            name: 'delivery_range',
            xtype: 'numberfield',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            minValue: 1,
            allowDecimals: true,
            decimalPrecision: 1,
            step: 0.4
        }, {
            xtype: 'checkboxfield',
            fieldLabel: 'Disable Online Payments',
            labelAlign: 'right',
            labelWidth: 250,
            name: "disable_online_payments"
        }, {
            xtype: 'checkboxfield',
            fieldLabel: 'Allow Payment on Delivery or Collection for Unverified Users',
            labelAlign: 'right',
            labelWidth: 250,
            name: "allow_unverified_pod_or_col_payment"
        }, {
            xtype: 'checkboxfield',
            fieldLabel: 'Open All Day',
            labelAlign: 'right',
            labelWidth: 250,
            name: "open_all_day",
            listeners: {
                // Enable / disable the opening / closing time fields.
                change: function( field, newValue ) {
                    if ( newValue === true ) {
                        this.form.getForm().findField( 'opening_time' ).setDisabled( true );
                        this.form.getForm().findField( 'closing_time' ).setDisabled( true );
                    } else {
                        this.form.getForm().findField( 'opening_time' ).setDisabled( false );
                        this.form.getForm().findField( 'closing_time' ).setDisabled( false );
                    }
                }.bind( this )
            }
        }, {
            xtype: 'timefield',
            fieldLabel: 'Opening Time',
            minValue: '00:00 AM',
            maxValue: '23:30 PM',
            name: "opening_time",
            increment: 30,
            labelWidth: 250,
            labelAlign: 'right',
            format: 'H:i'
        }, {
            xtype: 'timefield',
            fieldLabel: 'Closing Time',
            name: "closing_time",
            minValue: '00:00 AM',
            maxValue: '23:30 PM',
            increment: 30,
            labelAlign: 'right',
            labelWidth: 250,
            format: 'H:i'
        }, {
            xtype: 'checkboxfield',
            fieldLabel: 'Lunch Break',
            labelAlign: 'right',
            labelWidth: 250,
            name: "lunch_break",
            listeners: {
                // Enable / disable the opening / closing time fields.
                change: function( field, newValue ) {
                    if ( newValue === false ) {
                        this.form.getForm().findField( 'lunch_break_end' ).setDisabled( true );
                        this.form.getForm().findField( 'lunch_break_start' ).setDisabled( true );
                    } else {
                        this.form.getForm().findField( 'lunch_break_end' ).setDisabled( false );
                        this.form.getForm().findField( 'lunch_break_start' ).setDisabled( false );
                    }
                }.bind( this )
            }
        }, {
            xtype: 'timefield',
            fieldLabel: 'Lunch Break Start',
            minValue: '00:00 AM',
            maxValue: '23:30 PM',
            name: "lunch_break_start",
            disabled: true,
            increment: 30,
            labelWidth: 250,
            labelAlign: 'right',
            format: 'H:i'
        }, {
            xtype: 'timefield',
            fieldLabel: 'Lunch Break End',
            disabled: true,
            minValue: '00:00 AM',
            maxValue: '23:30 PM',
            name: "lunch_break_end",
            increment: 30,
            labelAlign: 'right',
            labelWidth: 250,
            format: 'H:i'
        }, {
            fieldLabel: 'Domain Name',
            name: 'domain_name',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 250
        }, {
            fieldLabel: 'Domain Name Alias',
            name: 'domain_name_alias',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 250
        }, {
            fieldLabel: 'Order Confirmation From',
            name: 'order_confirmation_from',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 250
        }, {
            fieldLabel: 'Site Contact Recipient Email',
            name: 'site_contact_recipient_email',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 250
        } ]
        ,buttons: [ {
            text: 'Reset',
            handler: function() {
                this.loadSettings();
            }.bind( this )
        }, {
            text: 'Submit',
            tabIndex: 4,
            handler: function() {
                this.submitFormData();
            }.bind( this )
        } ]
    } );

    // Panel itself.
    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: "Restaurant Settings"
        ,items: [ this.form ]
        ,layout: 'fit'
        ,listeners: {
            render: this.loadSettings.bind( this )
        }
    } );
}

FOBO.ui.prototype.restaurantSettings.prototype.loadSettings = function() {
    // Create a load mask, to let the user know
    // that we are fetching data.
    this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    // Show - and hide once AJAX data is returned.
    this.loadMask.show();

    // Trigger an AJAX call for loading form values.
    this.fetchSettings();
}

FOBO.ui.prototype.restaurantSettings.prototype.fetchSettings = function() {
    // Create AJAX request object, and get form data.
    Ext.Ajax.request({
        url: '/api/restaurant-settings/',
        success: function(response){
            var data;

            // Populate the form, with data...if any.
            try {
                data = Ext.decode( response.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            if ( data ) {
                this.form.getForm().findField( 'restaurant_name').setValue( data.restaurant_name );
                this.form.getForm().findField( 'restaurant_post_code').setValue( data.restaurant_post_code );
                this.form.getForm().findField( 'delivery_range').setValue( data.delivery_range );
                this.form.getForm().findField( 'disable_online_payments').setValue( data.disable_online_payments );
                this.form.getForm().findField( 'opening_time').setValue( data.opening_time );
                this.form.getForm().findField( 'closing_time').setValue( data.closing_time );
                this.form.getForm().findField( 'open_all_day').setValue( data.open_all_day );
                this.form.getForm().findField( 'lunch_break').setValue( data.lunch_break );
                this.form.getForm().findField( 'lunch_break_start').setValue( data.lunch_break_start );
                this.form.getForm().findField( 'lunch_break_end').setValue( data.lunch_break_end );
                this.form.getForm().findField( 'domain_name').setValue( data.domain_name );
                this.form.getForm().findField( 'domain_name_alias').setValue( data.domain_name_alias );
                this.form.getForm().findField( 'default_collection_time').setValue( data.default_collection_time );
                this.form.getForm().findField( 'default_delivery_time').setValue( data.default_delivery_time );
                this.form.getForm().findField( 'order_confirmation_from').setValue( data.order_confirmation_from );
                this.form.getForm().findField( 'minimum_website_order_value').setValue( data.minimum_website_order_value );
                this.form.getForm().findField( 'site_contact_recipient_email').setValue( data.site_contact_recipient_email );
                this.form.getForm().findField( 'allow_unverified_pod_or_col_payment').setValue( data.allow_unverified_pod_or_col_payment );
            }

            // Hide the load mask.
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}

FOBO.ui.prototype.restaurantSettings.prototype.submitFormData = function() {
    this.loadMask.show();

    // Prepare opening and closing time.
    var opening_time_string = this.form.getForm().findField( 'opening_time').getRawValue(),
        closing_time_string = this.form.getForm().findField( 'closing_time').getRawValue(),
        lunch_break_end = this.form.getForm().findField( 'lunch_break_end').getRawValue(),
        lunch_break_start = this.form.getForm().findField( 'lunch_break_start').getRawValue();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/restaurant-settings/',
        method: 'POST',
        params: {
            restaurant_name: this.form.getForm().findField( 'restaurant_name').getValue(),
            restaurant_post_code: this.form.getForm().findField( 'restaurant_post_code').getValue(),
            delivery_range: this.form.getForm().findField( 'delivery_range').getValue(),
            disable_online_payments: this.form.getForm().findField( 'disable_online_payments').getValue() ? 1 : 0,
            opening_time: opening_time_string,
            closing_time: closing_time_string,
            open_all_day: this.form.getForm().findField( 'open_all_day').getValue() ? 1 : 0,
            lunch_break_end: lunch_break_end,
            lunch_break_start: lunch_break_start,
            lunch_break: this.form.getForm().findField( 'lunch_break').getValue() ? 1 : 0,
            domain_name: this.form.getForm().findField( 'domain_name').getValue(),
            domain_name_alias: this.form.getForm().findField( 'domain_name_alias').getValue(),
            default_collection_time: this.form.getForm().findField( 'default_collection_time').getValue(),
            default_delivery_time: this.form.getForm().findField( 'default_delivery_time').getValue(),
            order_confirmation_from: this.form.getForm().findField( 'order_confirmation_from').getValue(),
            minimum_website_order_value: this.form.getForm().findField( 'minimum_website_order_value').getValue(),
            site_contact_recipient_email: this.form.getForm().findField( 'site_contact_recipient_email').getValue(),
            allow_unverified_pod_or_col_payment: this.form.getForm().findField( 'allow_unverified_pod_or_col_payment').getValue() ? 1 : 0
        },
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}