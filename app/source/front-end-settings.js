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
        title: 'Public Contact Details',
        frame: false,
        border: false,
        defaultType: 'textfield',
        bodyPadding: 5,
        items: [{
            fieldLabel: 'Phone Number(s)',
            name: 'phone_numbers',
            labelAlign: 'right',
            tabIndex: 1,
            width: 450,
            labelWidth: 150
        }, {
            fieldLabel: 'Full Address',
            name: 'full_address',
            labelAlign: 'right',
            tabIndex: 2,
            width: 450,
            labelWidth: 150
        }, {
            fieldLabel: 'Info Text',
            name: 'info_text',
            labelAlign: 'right',
            tabIndex: 3,
            width: 450,
            labelWidth: 150
        }],
        buttons: [ {
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
        border: false,
        layout: 'fit',
        items: [{
            xtype: 'tinymce_textarea',
            fieldStyle: 'font-family: Courier New; font-size: 12px;',
            style: { border: '0' },
            //noWysiwyg: true,
            tinyMCEConfig: {
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code fullscreen",
                    "insertdatetime media nonbreaking save table directionality",
                    "paste textcolor"
                ],
                toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor",
                toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
                menubar: true,
                toolbar_items_size: 'small'
            },
            id: 'restaurant_description',
            name: 'restaurant_description',
            value: ''
        }],
        buttons: [ {
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
        border: false,
        defaultType: 'textfield',
        bodyPadding: 5,
        items: [{
            fieldLabel: 'Facebook Page URL',
            name: 'facebook_page_url',
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 150
        }, {
            fieldLabel: 'Google Page URL',
            name: 'google_page_url',
            labelAlign: 'right',
            tabIndex: 2,
            labelWidth: 150
        }, {
            fieldLabel: 'Twitter URL',
            name: 'twitter_page_url',
            labelAlign: 'right',
            tabIndex: 3,
            labelWidth: 150
        }],
        buttons: [ {
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
        title: "Front End Settings"
        // TODO: Implement.
        ,items: [ this.descriptionPanel, this.socialPanel, this.contactPanel ]
        ,layout: 'fit'
        ,listeners: {
            render: this.loadSettings.bind( this )
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
                this.descriptionPanel.getForm().findField('restaurant_description').setValue(data.restaurant_description);
                this.contactPanel.getForm().findField('phone_numbers').setValue(data.phone_numbers);
                this.contactPanel.getForm().findField('full_address').setValue(data.full_address);
                this.contactPanel.getForm().findField('info_text').setValue(data.info_text);
                this.socialPanel.getForm().findField('facebook_page_url').setValue(data.facebook_page_url);
                this.socialPanel.getForm().findField('google_page_url').setValue(data.google_page_url);
                this.socialPanel.getForm().findField('twitter_page_url').setValue(data.twitter_page_url);
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
        params: {
            restaurant_description: this.descriptionPanel.getForm().findField('restaurant_description').getValue(),
            phone_numbers: this.contactPanel.getForm().findField('phone_numbers').getValue(),
            full_address: this.contactPanel.getForm().findField('full_address').getValue(),
            info_text: this.contactPanel.getForm().findField('info_text').getValue(),
            facebook_page_url: this.socialPanel.getForm().findField('facebook_page_url').getValue(),
            google_page_url: this.socialPanel.getForm().findField('google_page_url').getValue(),
            twitter_page_url: this.socialPanel.getForm().findField('twitter_page_url').getValue()
        },
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}