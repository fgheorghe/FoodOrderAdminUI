/**
 * @fileOverview Hosts the settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.apiAccessTokenSettings = function() {
    this.init();
};

/**
 * Makes a backend call for generating news access keys.
 */
FOBO.ui.prototype.apiAccessTokenSettings.prototype.generateNewKeys = function() {
    // First, confirm with the user.
    Ext.Msg.show({
        title: 'Confirm key change?',
        msg: 'Generating access keys requires update for API clients. Continue?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.WARNING,
        fn: function (btn) {
            if (btn === 'yes') {
                this.loadMask.show();
                Ext.Ajax.request({
                    url: '/api/generate-api-access-token/',
                    method: "POST",
                    success: function(response, opts) {
                        this.loadMask.hide();
                        this.loadTokens();
                    }.bind( this ),
                    failure: function(response, opts) {
                        // TODO: Implement.
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }
        }.bind(this)
    });
}

// Loads existing tokens.
FOBO.ui.prototype.apiAccessTokenSettings.prototype.loadTokens = function() {
    this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg: "Please wait..." } );
    this.loadMask.show();

    Ext.Ajax.request({
        url: '/api/api-access-tokens/',
        method: "GET",
        success: function(response, opts) {
            this.loadMask.hide();
            var data;
            // Check if user has been created
            try {
                data = Ext.decode( response.responseText );
                this.form.getForm().findField('access_token_1').setValue(data.token_1);
                this.form.getForm().findField('access_token_2').setValue(data.token_2);
            } catch (Ex) {
                // Do nothing.
            }
        }.bind( this ),
        failure: function(response, opts) {
            // TODO: Implement.
            console.log('server-side failure with status code ' + response.status);
        }
    });
}

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.apiAccessTokenSettings.prototype.init = function() {
    // Form panel, hosting input fields.
    this.form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        bodyPadding: 5,
        items: [ {
            fieldLabel: 'Access Token 1',
            name: 'access_token_1',
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 150,
            width: 420,
            readOnly: true
        }, {
            fieldLabel: 'Access Token 2',
            name: 'access_token_2',
            editable: false,
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 150,
            width: 420,
            readOnly: true
        } ]
        ,buttons: [ {
            text: 'Generate New Keys',
            handler: function() {
                this.generateNewKeys();
            }.bind( this )
        } ]
    });

    // Panel itself.
    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: "API Access Token Settings"
        ,items: [this.form]
        ,layout: 'fit'
        ,listeners: {
            render: this.loadTokens.bind( this )
        }
    } );
}