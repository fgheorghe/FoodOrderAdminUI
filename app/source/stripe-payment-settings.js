/**
 * @fileOverview Hosts the payment settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.stripePaymentSettings = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.stripePaymentSettings.prototype.init = function() {
    // Form panel, hosting input fields.
    this.form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        bodyPadding: 5,
        items: [ {
            fieldLabel: 'Secret Key',
            name: 'stripe_secret_key',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 240
        }, {
            fieldLabel: 'Publishable Key',
            name: 'stripe_publishable_key',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 240
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
        title: "Stripe Payment Settings"
        ,items: [ this.form ]
        ,layout: 'fit'
        ,listeners: {
            render: this.loadSettings.bind( this )
        }
    } );
}

FOBO.ui.prototype.stripePaymentSettings.prototype.loadSettings = function() {
    // Create a load mask, to let the user know
    // that we are fetching data.
    this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    // Show - and hide once AJAX data is returned.
    this.loadMask.show();

    // Trigger an AJAX call for loading form values.
    this.fetchSettings();
}

FOBO.ui.prototype.stripePaymentSettings.prototype.fetchSettings = function() {
    // Create AJAX request object, and get form data.
    Ext.Ajax.request({
        url: '/api/stripe-payment-settings/',
        success: function(response){
            var data;

            // Populate the form, with data...if any.
            try {
                data = Ext.decode( response.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            if ( data ) {
                this.form.getForm().findField( 'stripe_secret_key').setValue( data.stripe_secret_key );
                this.form.getForm().findField( 'stripe_publishable_key').setValue( data.stripe_publishable_key );
            }

            // Hide the load mask.
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}

FOBO.ui.prototype.stripePaymentSettings.prototype.submitFormData = function() {
    this.loadMask.show();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/stripe-payment-settings/',
        method: 'POST',
        params: {
            stripe_secret_key: this.form.getForm().findField( 'stripe_secret_key').getValue(),
            stripe_publishable_key: this.form.getForm().findField( 'stripe_publishable_key').getValue()
        },
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}