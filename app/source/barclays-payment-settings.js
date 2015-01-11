/**
 * @fileOverview Hosts the payment settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.barclaysPaymentSettings = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.barclaysPaymentSettings.prototype.init = function() {
    // Form panel, hosting input fields.
    this.form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        bodyPadding: 5,
        items: [ {
            fieldLabel: 'Your Barclays Affiliation Name',
            name: 'pspid',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 240
        }, {
            fieldLabel: 'SHA1 Signature',
            name: 'sha1',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 240
        }, {
            xtype: 'checkboxfield',
            fieldLabel: 'Live payment system',
            labelAlign: 'right',
            labelWidth: 240,
            name: "live_payment_system"
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
        title: "Barclays Payment Settings"
        ,items: [ this.form ]
        ,layout: 'fit'
        ,listeners: {
            render: this.loadSettings.bind( this )
        }
    } );
}

FOBO.ui.prototype.barclaysPaymentSettings.prototype.loadSettings = function() {
    // Create a load mask, to let the user know
    // that we are fetching data.
    this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    // Show - and hide once AJAX data is returned.
    this.loadMask.show();

    // Trigger an AJAX call for loading form values.
    this.fetchSettings();
}

FOBO.ui.prototype.barclaysPaymentSettings.prototype.fetchSettings = function() {
    // Create AJAX request object, and get form data.
    Ext.Ajax.request({
        url: '/api/barclays-payment-settings/',
        success: function(response){
            var data;

            // Populate the form, with data...if any.
            try {
                data = Ext.decode( response.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            if ( data ) {
                this.form.getForm().findField( 'pspid').setValue( data.pspid );
                this.form.getForm().findField( 'sha1').setValue( data.sha1 );
                this.form.getForm().findField( 'live_payment_system').setValue( data.live_payment_system )
            }

            // Hide the load mask.
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}

FOBO.ui.prototype.barclaysPaymentSettings.prototype.submitFormData = function() {
    this.loadMask.show();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/barclays-payment-settings/',
        method: 'POST',
        params: {
            pspid: this.form.getForm().findField( 'pspid').getValue(),
            sha1: this.form.getForm().findField( 'sha1').getValue(),
            live_payment_system: this.form.getForm().findField( 'live_payment_system').getValue() ? 1 : 0
        },
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}