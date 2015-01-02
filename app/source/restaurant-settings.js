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
            labelWidth: 150,
        }, {
            fieldLabel: 'Restaurant Post Code',
            name: 'restaurant_post_code',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 150,
        }, {
            fieldLabel: 'Delivery Range (miles)',
            labelWidth: 150,
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
            xtype: 'timefield',
            fieldLabel: 'Opening Time',
            minValue: '6:00 AM',
            maxValue: '8:00 PM',
            name: "opening_time",
            increment: 30,
            labelWidth: 150,
            labelAlign: 'right',
            format: 'H:i'
        }, {
            xtype: 'timefield',
            fieldLabel: 'Closing Time',
            minValue: '6:00 AM',
            name: "closing_time",
            maxValue: '8:00 PM',
            increment: 30,
            labelAlign: 'right',
            labelWidth: 150,
            format: 'H:i'
        }, {
            xtype: 'checkboxfield',
            fieldLabel: 'Open all day',
            labelAlign: 'right',
            labelWidth: 150,
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
            fieldLabel: 'Domain name',
            name: 'domain_name',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 150
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
                this.form.getForm().findField( 'opening_time').setValue( data.opening_time );
                this.form.getForm().findField( 'closing_time').setValue( data.closing_time );
                this.form.getForm().findField( 'open_all_day').setValue( data.open_all_day );
                this.form.getForm().findField( 'domain_name').setValue( data.domain_name );
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
        closing_time_string = this.form.getForm().findField( 'closing_time').getRawValue();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/restaurant-settings/',
        method: 'POST',
        params: {
            restaurant_name: this.form.getForm().findField( 'restaurant_name').getValue(),
            restaurant_post_code: this.form.getForm().findField( 'restaurant_post_code').getValue(),
            delivery_range: this.form.getForm().findField( 'delivery_range').getValue(),
            opening_time: opening_time_string,
            closing_time: closing_time_string,
            open_all_day: this.form.getForm().findField( 'open_all_day').getValue() ? 1 : 0,
            domain_name: this.form.getForm().findField( 'domain_name').getValue()
        },
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}