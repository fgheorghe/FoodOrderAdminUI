/**
 * @fileOverview Hosts the settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.frontEndSettings = function() {
    this.init();
};

/**
 * Prepares tab panels.
 */
FOBO.ui.prototype.frontEndSettings.prototype.createPanels = function() {
    this.contactPanel = Ext.create( 'Ext.form.Panel', {
        title: 'Contact Details',
        frame: false,
        border: false
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

    this.descriptionPanel = Ext.create( 'Ext.form.Panel', {
        title: 'Restaurant Description',
        frame: false,
        border: false
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

    this.socialPanel = Ext.create( 'Ext.form.Panel', {
        title: 'Social Media',
        frame: false,
        border: false
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
}

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.frontEndSettings.prototype.init = function() {
    // Prepare tab panels.
    this.createPanels();

    // Panel itself.
    this.panel = Ext.create( 'Ext.tab.Panel', {
        title: "Front-End Settings"
        // TODO: Implement.
        ,items: [ this.contactPanel, this.descriptionPanel, this.socialPanel ]
        ,layout: 'fit'
        ,listeners: {
            //render: this.loadSettings.bind( this )
        }
    } );
}

FOBO.ui.prototype.frontEndSettings.prototype.loadSettings = function() {
    // Create a load mask, to let the user know
    // that we are fetching data.
    this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    // Show - and hide once AJAX data is returned.
    this.loadMask.show();

    // Trigger an AJAX call for loading form values.
    this.fetchSettings();
}

FOBO.ui.prototype.frontEndSettings.prototype.fetchSettings = function() {
    // Create AJAX request object, and get form data.
    Ext.Ajax.request({
        url: '/api/front-end-settings/',
        success: function(response){
            var data;

            // Populate the form, with data...if any.
            try {
                data = Ext.decode( response.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            // TODO: Implement.

            // Hide the load mask.
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}

FOBO.ui.prototype.frontEndSettings.prototype.submitFormData = function() {
    this.loadMask.show();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/front-end-settings/',
        method: 'POST',
        // TODO: Implement.
        params: {},
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}