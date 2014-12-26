/**
 * Created by fgheorghe on 27/11/14.
 */

// Hosts the new / view customer window.
FOBO.shared.customerWindow = function(customerId, customerData, callBack) {
    this.cb = callBack;
    this.customerId = customerId;
    this.customerData = customerData;
    this.init();
}

/**
 * Initialize the application.
 */
FOBO.shared.customerWindow.prototype.init = function() {
    this.createInputFields();
    this.createForm();
    this.createWindow();
}

/**
 * Create input fields.
 */
FOBO.shared.customerWindow.prototype.createInputFields = function() {
    this.customerNameField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Customer Name',
        width: 350,
        labelWidth: 120,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false,
        value: this.customerId ? this.customerData.name : ""
    });
    this.customerEmailField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Email Address',
        width: 350,
        labelWidth: 120,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false,
        value: this.customerId ? this.customerData.email : ""
    });
    this.customerPostCodeField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Post Code',
        width: 350,
        labelWidth: 120,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false,
        value: this.customerId ? this.customerData.post_code : ""
    });
    this.customerPhoneNumberField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Phone Number',
        width: 350,
        labelWidth: 120,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false,
        value: this.customerId ? this.customerData.phone_number : ""
    });
    this.customerAddressField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Address',
        width: 350,
        labelWidth: 120,
        labelAlign: 'right',
        xtype: 'textfield',
        allowBlank: false,
        value: this.customerId ? this.customerData.address : ""
    });
    this.passwordTextField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Password'
        ,labelWidth: 120
        ,width: 350
        ,labelAlign: 'right'
        ,inputType: 'password'
        ,inputValue: true
        ,allowBlank: this.customerId ? true : false
    } );
    this.verifiedCustomer = Ext.create( 'Ext.form.field.Checkbox', {
        fieldLabel: 'Verified Customer'
        ,labelWidth: 120
        ,inputValue: true,
        checked: this.customerId && this.customerData.verified === 1 ? true : false
    } );

}

/**
 * Creates the customer form.
 */
FOBO.shared.customerWindow.prototype.createForm = function() {
    this.form = Ext.create( 'Ext.form.Panel', {
        border: false,
        frame: false,
        bodyPadding: 5,
        items: [
            this.customerNameField
            ,this.customerEmailField
            ,this.customerPostCodeField
            ,this.customerPhoneNumberField
            ,this.customerAddressField
            ,this.verifiedCustomer
            ,this.passwordTextField
        ]
        ,buttons: [{
            text: 'Reset',
            handler: function() {
                this.form.getForm().reset();
            }.bind( this )
        }, {
            text: this.customerId ? 'Save' : 'Add',
            handler: function() {
                var method = 'POST',
                    url = this.customerId ? '/api/customer/' + this.customerId : '/api/customer/';
                if ( this.form.getForm().isValid() ) {
                    this.customerLoadMask = new Ext.LoadMask( this.window.getEl(), { msg: "Please wait..." } );
                    this.customerLoadMask.show();
                    Ext.Ajax.request({
                        url: url,
                        method: method,
                        params: {
                            name: this.customerNameField.getValue()
                            ,post_code: this.customerPostCodeField.getValue()
                            ,phone_number: this.customerPhoneNumberField.getValue()
                            ,address: this.customerAddressField.getValue()
                            ,email: this.customerEmailField.getValue()
                            ,verified: this.verifiedCustomer.getValue() !== true ? 0 : 1
                            ,password: this.passwordTextField.getValue()
                        },
                        success: function(response, opts) {
                            this.customerLoadMask.hide();
                            this.window.close();

                            // Call a configured callback.
                            if (this.cb) {
                                this.cb();
                            }
                        }.bind( this ),
                        failure: function(response, opts) {
                            this.customerLoadMask.hide();
                            // TODO: Implement.
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }.bind( this )
        }]
    } );
}

/**
 * Creates the customer window.
 */
FOBO.shared.customerWindow.prototype.createWindow = function() {
    this.window = Ext.create( 'Ext.window.Window', {
        title: this.customerId ? 'Edit Customer' : 'Add Customer'
        ,modal: true
        ,height: 290
        ,width: 380
        ,layout: 'fit'
        ,items: [ this.form ]
    } );
}