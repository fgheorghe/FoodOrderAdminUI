/**
 * @fileOverview Provides login functionality.
 */

/**
 * @constructor Constructor for the login class. Will display the login window.
 * @param {Fucntion} callback Callback function, upon successful login.
 */
FOBO.login = function( callback ) {
    // Store callback function.
    this._callback = callback;

    // Initialise.
    this.init();
}

/**
 * @function Method used for initializing the login object.
 */
FOBO.login.prototype.init = function() {
    // First, check if the user is logged in.
    this.verifyLogin();
}

/**
 * Shows the login ui.
 * @function
 */
FOBO.login.prototype.showLoginUi = function() {
    // Hide the verify mask, and let it be replaced by another one.
    this.mask.hide();
    this.createLoginForm();
    this.createLoginWindow();
}

/**
 * Checks if the user is logged in, by making a request to /api/ehlo.
 * If the user is logged in, skips straight to the UI, otherwise, asks for a password.
 */
FOBO.login.prototype.verifyLogin = function() {
    // Verify login mask.
    this.mask = new Ext.LoadMask( Ext.getBody(), { msg: "Verifying login..." } );
    this.mask.show();

    // Create Ajax request to the /menu-item-categories/ service.
    Ext.Ajax.request( {
        url: '/api/ehlo/',
        method: "GET",
        success: function( raw ) {
            // Try and decode data.
            var response;
            try {
                response = Ext.decode( raw.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            // Jump straight to the user interface if the user is already logged in.
            if (typeof response.ehlo !== "undefined" && response.ehlo) {
                this.preloadData();
            } else {
                // Else show the login UI.
                this.showLoginUi();
            }
        }.bind(this),
        failure: function() {
            // Show the login UI.
            this.showLoginUi();
        }.bind(this)
    } );
}

/**
 * @function Method used for pre-loading some UI data, such as menu item categories.
 */
FOBO.login.prototype.preloadData = function() {
    // Create Ajax request to the /menu-item-categories/ service.
    Ext.Ajax.request( {
        url: '/api/menu-item-categories/',
        method: "GET",
        success: function( raw ) {
            // Try and decode data.
            var response;
            try {
                response = Ext.decode( raw.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            // Hide the login mask.
            this.mask.hide();

            // Check if we have a valid data array
            if ( _.isArray( response ) ) {
                // Store in the common data object.
                Common.FoodMenu.MenuItemCategories = response;

                // Hide the login window...if it was displayed.
                if (this.window) {
                    this.window.hide();
                }
                // Call the authentication callback, if any.
                if ( this._callback ) {
                    this._callback();
                }
            } else {
                // Notify the user that something went wrong.
                Ext.Msg.alert('Error', 'Can not connect to server. Please try again later.');
            }
        }.bind( this ),
        failure: function() {
            // Hide the load mask.
            this.mask.hide();

            // Notify the user that something went wrong.
            Ext.Msg.alert('Error', 'Can not connect to server. Please try again later.');
        }.bind( this )
    } );
}

/**
 * @function Method for handling a successful Login ajax request, based on which we figure out of the user credentials are valid or not.
 */
FOBO.login.prototype.successEventHandler = function( raw, event ) {
    // Try and decode data.
    var response = { success: false };
    try {
        response = Ext.decode( raw.responseText );
    } catch ( Ex ) {
        // Do nothing.
    }

    // If failed, notify the user.
    if ( !response.success ) {
        Ext.Msg.alert('Error', 'Authentication failed, please try again.');
        // Hide mask.
        this.mask.hide();
    } else {
        // Pre load data.
        this.preloadData();
    }
}

/**
 * @function Method used for handling a failed Ajax request.
 */
FOBO.login.prototype.failureEventHandler = function( response, event ) {
    // Hide mask
    this.mask.hide();
    // Display user friendly error message.
    Ext.Msg.alert('Error', 'Can not connect to server. Please try again later.');
}

/**
 * @function Login button handler. Used for validating the login form, and triggering an Ajax call.
 */
FOBO.login.prototype.loginButtonHandler = function() {
    // Validate the form.
    if ( this.form.getForm().isValid() ) {
        // Create a load mask.
        this.mask = new Ext.LoadMask( this.window, { msg: "Authenticating..." } );
        // Show mask.
        this.mask.show();

        // Create Ajax request to the /login/ service.
        Ext.Ajax.request( {
            url: '/api/login/',
            method: "POST",
            params: {
                username: this.usernameInputField.getValue(),
                password: this.passwordInputField.getValue()
            },
            success: this.successEventHandler.bind( this ),
            failure: this.failureEventHandler.bind( this )
        } );
    } else {
        // Display user friendly error message.
        Ext.Msg.alert('Error', 'Please input a valid Email Address and Password.');
    }
}

/**
 * @function Method used for creating the login form, and components.
 */
FOBO.login.prototype.createLoginForm = function() {
    // Create input fields.
    this.usernameInputField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: "Email Address",
        labelAlign: "right",
        width: 300,
        tabIndex: 1,
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            keypress : function( object, event){
                // On Return key press, trigger a call to the login button handler method.
                if ( event.getCharCode() === Ext.EventObject.ENTER) {
                    this.loginButtonHandler.bind( this )();
                }
            }.bind( this )
        }
    } );

    this.passwordInputField = Ext.create( 'Ext.form.field.Text', {
        fieldLabel: 'Password',
        labelAlign: 'right',
        inputType: 'password',
        width: 300,
        tabIndex: 2,
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            keypress : function( object, event){
                // On Return key press, trigger a call to the login button handler method.
                if ( event.getCharCode() === Ext.EventObject.ENTER) {
                    this.loginButtonHandler.bind( this )();
                }
            }.bind( this )
        }
    } );

    // Create form buttons
    this.resetButton = Ext.create( 'Ext.button.Button', {
        text: 'Reset',
        handler: function() {
            // Clear form fields
            this.form.getForm().reset();
        }.bind( this )
    } );

    this.loginButton = Ext.create( 'Ext.button.Button', {
        text: 'Login',
        tabIndex: 3,
        handler: this.loginButtonHandler.bind( this )
    } );

    // Create the form.
    this.form = Ext.create( 'Ext.form.Panel', {
        border: false,
        bodyPadding: 5,
        items: [ this.usernameInputField, this.passwordInputField ],
        buttons: [ this.resetButton, this.loginButton ]
    } );
}

/**
 * @function Create and show the login window.
 */
FOBO.login.prototype.createLoginWindow = function() {
    // Create the window.
    this.window = Ext.create( 'Ext.window.Window', {
        modal: true,
        title: "Login",
        height: 142,
        width: 320,
        closable: false,
        resizable: false,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        items: [ this.form ]
    } );

    // Show window.
    this.window.show();
}