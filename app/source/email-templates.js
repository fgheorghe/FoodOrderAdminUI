/**
 * @fileOverview Hosts the payment settings panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.emailTemplates = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.emailTemplates.prototype.init = function() {
    // Form panel, hosting input fields.
    this.form = Ext.create( 'Ext.form.Panel', {
        defaultType: 'textfield',
        frame: false,
        border: false,
        bodyPadding: 5,
        items: [ {
            fieldLabel: 'Order Accepted Email Subject',
            name: 'order_accepted_email_subject',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 1,
            labelWidth: 240
        }, {
            xtype: 'tinymce_textarea',
            fieldStyle: 'font-family: Courier New; font-size: 12px;',
            fieldLabel: "Order Accepted Email Content",
            height: 220,
            width: 850,
            allowBlank: false,
            style: { border: '0' },
            labelAlign: 'right',
            labelWidth: 240,
            tabIndex: 2,
            //noWysiwyg: true,
            tinyMCEConfig: {
                plugins: [
                    "charmap preview hr anchor pagebreak",
                    "visualblocks visualchars code fullscreen",
                    "media nonbreaking table",
                    "paste textcolor"
                ],
                toolbar1: "fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | hr removeformat | subscript superscript | charmap fullscreen | ltr rtl | nonbreaking pagebreak | cut copy paste | searchreplace | outdent indent blockquote | undo redo | link unlink anchor image code | preview | forecolor backcolor",
                menubar: false,
                toolbar_items_size: 'small'
            },
            name: 'order_accepted_email_content',
            id: 'order_accepted_email_content',
            value: ''
        }, {
            fieldLabel: 'Order Rejected Email Subject',
            name: 'order_rejected_email_subject',
            allowBlank: false,
            labelAlign: 'right',
            tabIndex: 3,
            labelWidth: 240
        }, {
            xtype: 'tinymce_textarea',
            fieldStyle: 'font-family: Courier New; font-size: 12px;',
            fieldLabel: "Order Rejected Email Content",
            height: 220,
            width: 850,
            labelWidth: 240,
            labelAlign: 'right',
            tabIndex: 4,
            allowBlank: false,
            style: { border: '0' },
            //noWysiwyg: true,
            tinyMCEConfig: {
                plugins: [
                    "charmap preview hr anchor pagebreak",
                    "visualblocks visualchars code fullscreen",
                    "media nonbreaking table",
                    "paste textcolor"
                ],
                toolbar1: "fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect | hr removeformat | subscript superscript | charmap fullscreen | ltr rtl | nonbreaking pagebreak | cut copy paste | searchreplace | outdent indent blockquote | undo redo | link unlink anchor image code | preview | forecolor backcolor",                toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor",
                menubar: false,
                toolbar_items_size: 'small'
            },
            id: 'order_rejected_email_content',
            name: 'order_rejected_email_content',
            value: ''
        } ]
        ,buttons: [ {
            text: 'Reset',
            handler: function() {
                this.loadSettings();
            }.bind( this )
        }, {
            text: 'Submit',
            tabIndex: 5,
            handler: function() {
                this.submitFormData();
            }.bind( this )
        } ]
    } );

    // Panel itself.
    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: "Email Templates"
        ,items: [ this.form ]
        ,layout: 'fit'
        ,listeners: {
            render: this.loadSettings.bind( this )
        }
    } );
}

FOBO.ui.prototype.emailTemplates.prototype.loadSettings = function() {
    // Create a load mask, to let the user know
    // that we are fetching data.
    this.loadMask = new Ext.LoadMask( this.panel.getEl(), { msg:"Please wait..."} );
    // Show - and hide once AJAX data is returned.
    this.loadMask.show();

    // Trigger an AJAX call for loading form values.
    this.fetchSettings();
}

FOBO.ui.prototype.emailTemplates.prototype.fetchSettings = function() {
    // Create AJAX request object, and get form data.
    Ext.Ajax.request({
        url: '/api/email-templates/',
        success: function(response){
            var data;

            // Populate the form, with data...if any.
            try {
                data = Ext.decode( response.responseText );
            } catch ( Ex ) {
                // Do nothing.
            }

            if ( data ) {
                this.form.getForm().findField( 'order_accepted_email_subject').setValue( data.order_accepted_email_subject );
                this.form.getForm().findField( 'order_accepted_email_content').setValue( data.order_accepted_email_content );
                this.form.getForm().findField( 'order_rejected_email_subject').setValue( data.order_rejected_email_subject );
                this.form.getForm().findField( 'order_rejected_email_content').setValue( data.order_rejected_email_content );
            }

            // Hide the load mask.
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}

FOBO.ui.prototype.emailTemplates.prototype.submitFormData = function() {
    this.loadMask.show();

    // Create AJAX request object, and send form data.
    Ext.Ajax.request({
        url: '/api/email-templates/',
        method: 'POST',
        params: {
            order_accepted_email_subject: this.form.getForm().findField( 'order_accepted_email_subject').getValue(),
            order_accepted_email_content: this.form.getForm().findField( 'order_accepted_email_content').getValue(),
            order_rejected_email_content: this.form.getForm().findField( 'order_rejected_email_content').getValue(),
            order_rejected_email_subject: this.form.getForm().findField( 'order_rejected_email_subject').getValue()
        },
        success: function(){
            this.loadMask.hide();
        }.bind( this )
        // TODO: Add error handling.
    });
}
