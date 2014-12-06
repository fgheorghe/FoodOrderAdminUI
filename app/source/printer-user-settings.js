/**
 * @fileOverview Hosts the settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.printerUserSettings = function() {
    this.createStore();
    this.init();
};

/**
 * @function Method used for deleting a user.
 */
FOBO.ui.prototype.printerUserSettings.prototype.createActivateDeactiveUserPrompt = function() {
    var selection = this.panel.getSelectionModel().getSelection()[0],
        name = selection.raw.name,
        id = selection.raw.id,
        active = selection.raw.active_yn,
    // TODO: Make field name consistent.
        email = selection.raw.email;

    Ext.Msg.show( {
        title:'Confirm ' + ( active === 1 ? "deactivate" : "activate" ) + '?',
        msg: ( active === 1 ? "Deactivate" : "Activate" ) + ' printer user ' + name + ' (' + email + ') ?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.WARNING,
        fn: function( btn ) {
            if ( btn === 'yes' ) {
                Ext.Ajax.request({
                    url: '/api/user/' + ( active === 1 ? "deactivate" : "activate" ) + '/' + id,
                    method: "POST",
                    success: function(response, opts) {
                        this.panel.getSelectionModel().deselectAll();
                        // TODO: Add method for deactivating these buttons.
                        this.changePasswordButton.setDisabled( true );
                        this.deactivateUserButton.setDisabled( this );
                        this.refreshData();
                    }.bind( this ),
                    failure: function(response, opts) {
                        // TODO: Implement.
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }
        }.bind( this )
    } );
}

/**
 * @function Method used for changing a user's password.
 */
FOBO.ui.prototype.printerUserSettings.prototype.createChangeUserPasswordPrompt = function() {
    var selection = this.panel.getSelectionModel().getSelection()[0],
        id = selection.raw.id;

    // Create form.
    var form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        items: [ {
            fieldLabel: 'Password',
            name: 'password',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 1,
            inputType: 'password'
        } ]
    } );

    // Create window.
    var window = Ext.create( 'Ext.window.Window', {
        title: 'Change user password'
        ,modal: true
        ,height: 115
        ,width: 350
        ,items: [ form ]
        ,bodyPadding: 5
        ,layout: 'fit'
        ,buttons: [ {
            text: 'Reset',
            handler: function() {
                form.getForm().reset();
            }
        }, {
            text: 'Submit',
            tabIndex: 2,
            handler: function() {
                if ( form.getForm().isValid() ) {
                    // Prepare Ajax request data
                    var user = {
                        password: form.getForm().findField( 'password' ).getValue()
                    };

                    Ext.Ajax.request({
                        url: '/api/user/change-password/' + id,
                        method: "POST",
                        params: user,
                        success: function(response, opts) {
                            this.refreshData();
                            window.close();
                        }.bind( this ),
                        failure: function(response, opts) {
                            // TODO: Implement.
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }.bind( this )
        } ]
    } );

    // Show windows.
    window.show();
}

/**
 * @function Method used for creating the add user window, and showing it.
 */
FOBO.ui.prototype.printerUserSettings.prototype.createAddUserWindow = function() {
    // Prepare the username / email address input field.
    this.emailAddressTextField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Username',
        name: 'email',
        allowBlank: false,
        labelAlign: 'right',
        tabIndex: 3
    } );
    // Create a name text field.
    this.nameTextField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Identifier',
        name: 'name',
        allowBlank: false,
        labelAlign: 'right',
        tabIndex: 2
    } );

    // Create form.
    var form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        items: [ this.nameTextField, this.emailAddressTextField, {
            fieldLabel: 'Password',
            name: 'password',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 5,
            inputType: 'password'
        } ]
    } );

    // Create the window.
    var window = Ext.create( 'Ext.window.Window', {
        title: 'Add User'
        ,modal: true
        ,height: 190
        ,width: 300
        ,items: form
        ,bodyPadding: 5
        ,layout: 'fit'
        ,buttons: [ {
            text: 'Reset',
            handler: function() {
                form.getForm().reset();
            }
        }, {
            text: 'Submit',
            tabIndex: 6,
            handler: function() {
                if ( form.getForm().isValid() ) {
                    // Prepare Ajax request data
                    var user = {
                        role_id: 1,
                        name: form.getForm().findField( 'name' ).getValue(),
                        email: form.getForm().findField( 'email' ).getValue(),
                        password: form.getForm().findField( 'password' ).getValue()
                    };
                    this.userLoadMask = new Ext.LoadMask( window.getEl(), { msg: "Please wait..." } );
                    this.userLoadMask.show();
                    Ext.Ajax.request({
                        url: '/api/user/',
                        method: "POST",
                        params: user,
                        success: function(response, opts) {
                            this.userLoadMask.hide();
                            var data;
                            // Check if user has been created
                            try {
                                data = Ext.decode( response.responseText );
                                if ( data.error ) {
                                    Ext.Msg.alert('Error', "Can not create user, email address already in database.");
                                    form.getForm().findField( 'email' ).focus();
                                    form.getForm().findField( 'email' ).markInvalid();
                                    form.isValid();
                                    // Stop the process, until the user updates the email address.
                                    return;
                                }
                            } catch ( Ex ) {
                                // Do nothing.
                            }
                            this.refreshData();
                            window.close();
                        }.bind( this ),
                        failure: function(response, opts) {
                            this.userLoadMask.hide();
                            // TODO: Implement.
                            console.log('server-side failure with status code ' + response.status);
                        }
                    });
                }
            }.bind( this )
        } ]
    } );

    window.show();
}

/**
 * @function Reloads the main grid panel data.
 */
FOBO.ui.prototype.printerUserSettings.prototype.refreshData = function() {
    // Reload panel data.
    this.panel.getStore().load();
}

/**
 * @function Method used for creating the grid store.
 */
FOBO.ui.prototype.printerUserSettings.prototype.createStore = function() {
    this.store = Ext.create( 'Ext.data.JsonStore', {
        fields:[ 'id', 'active_yn', { name: 'create_date', type: 'date' }, { name: 'last_login', type: 'date' }, 'email', 'name', 'role_id' ],
        proxy:{
            type:'rest',
            url:'/api/users/printer',
            reader:{
                type: 'json',
                root:'data'
            }
        }
    } );
}

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.printerUserSettings.prototype.init = function() {
    // Prepare view buttons
    this.deactivateUserButton = Ext.create( 'Ext.button.Button', {
        text: 'Deactivate User',
        type: 'button',
        disabled: true,
        handler: this.createActivateDeactiveUserPrompt.bind( this )
    } );

    this.changePasswordButton = Ext.create( 'Ext.button.Button', {
        text: 'Change Password',
        type: 'button',
        disabled: true,
        handler: this.createChangeUserPasswordPrompt.bind( this )
    } );

    // Panel itself.
    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Printer Users',
        store: this.store,
        columns: [
            { header: 'Active', dataIndex: 'active_yn', width: 80, renderer: function( value ) {
                return value === 1 ? "Yes" : "No";
            } },
            { header: 'Identifier', dataIndex: 'name', flex: 1,
                renderer: Util.textColumnRenderer
            },
            { header: 'Username', dataIndex: 'email', width: 180,
                renderer: Util.textColumnRenderer
            },
            { header: 'Create Date', dataIndex: 'create_date', width: 100, renderer: Ext.util.Format.dateRenderer('d/m/Y') },
            { header: 'Last Query', dataIndex: 'last_login', width: 100, renderer: Ext.util.Format.dateRenderer('d/m/Y H:i') }
        ],
        tbar: {
            items: [ {
                text: 'Add User',
                type: 'button',
                handler: this.createAddUserWindow.bind( this )
            }, this.deactivateUserButton, this.changePasswordButton, {
                text: 'Refresh',
                type: 'button',
                handler: this.refreshData.bind( this )
            } ]
        },
        listeners: {
            itemclick: function( grid, record, item, index, e, eOpts ) {
                // Update text, for activating / deactivating a user.
                if ( record.data.active_yn === 0 ) {
                    this.deactivateUserButton.setText( "Activate User" );
                } else {
                    this.deactivateUserButton.setText( "Deactivate User" );
                }

                this.deactivateUserButton.setDisabled( false );
                this.changePasswordButton.setDisabled( false );
            }.bind( this )
        },
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            //store: this.store,
            displayInfo: true,
            displayMsg: 'Displaying users {0} - {1} of {2}',
            emptyMsg: "No items to display"
        } )
    } );
}