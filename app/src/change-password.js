/**
 * @fileOverview Hosts the change password panel logic and ui components.
 */

/**
 * @constructor Constructor for the changePassword class.
 */
FOBO.ui.prototype.changePassword = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.changePassword.prototype.init = function() {
    // Form panel, hosting input fields.
    this.form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        bodyPadding: 5,
        items: [ {
            fieldLabel: 'Current Password',
            name: 'current_password',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 150,
            inputType: 'password',
            allowBlank: false
        },{
            fieldLabel: 'New Password',
            name: 'new_password',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 150,
            inputType: 'password',
            allowBlank: false
        },{
            fieldLabel: 'Confirm New Password',
            labelWidth: 150,
            name: 'confirm_password',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            inputType: 'password',
            allowBlank: false
        } ]
        ,buttons: [ {
            text: 'Reset',
            handler: function() {
                this.form.getForm().reset();
            }
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
        title: "Change Password"
        ,items: [ this.form ]
        ,layout: 'fit'
    } );
}

FOBO.ui.prototype.changePassword.prototype.submitFormData = function() {
    // Prepare current and new password.
    var new_password = this.form.getForm().findField( 'new_password').getRawValue(),
        current_password = this.form.getForm().findField( 'current_password').getRawValue();

    // Check for password mismatch.
    if ( new_password !== this.form.getForm().findField( 'confirm_password').getRawValue() ) {
        Ext.Msg.alert('Error', "Can not change password - confirm and new password mismatch.");
        return;
    }

    // Create a load mask, to let the user know
    // that we are update data.
    if ( !this.loadMask ) {
        this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    }
    this.loadMask.show();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/users/change-password/',
        method: 'PUT',
        params: {
            new_password: new_password,
            current_password: current_password
        },
        success: function(response,opts) {
            var data;
            // Check if password update failed.
            try {
                data = Ext.decode( response.responseText );
                if ( data.error ) {
                    this.loadMask.hide();
                    Ext.Msg.alert('Error', "Can not update password - wrong current password.");
                    // Stop the process.
                    return;
                }
            } catch ( Ex ) {
                // Do nothing.
            }

            this.form.getForm().reset();
            this.loadMask.hide();
        }.bind( this )
        ,failure: function(response, opts) {
            // TODO: Implement.
            console.log('server-side failure with status code ' + response.status);
        }
    });
}