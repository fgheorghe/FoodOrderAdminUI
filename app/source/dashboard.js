/**
 * @fileOverview Hosts the dashboard panel logic and ui components.
 */

/**
 * @constructor Constructor for the settings class.
 */
FOBO.ui.prototype.dashboard = function() {
    this.init();
};

/**
 * @function Initialises the object, by creating required panels and items.
 */
FOBO.ui.prototype.dashboard.prototype.init = function() {
    // Prepare charts and panel.
    this.createCharts();

    this.panel = Ext.create( 'Ext.panel.Panel', {
        title: 'Dashboard',
        layout: {
            type: 'vbox',
            pack: 'start',
            align: 'stretch'
        },
        items: [
            Ext.create( 'Ext.panel.Panel', {
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                flex: 1,
                frame: false,
                border: false,
                margin: 5,
                items: [
                    Ext.create( 'Ext.panel.Panel', {
                            title: 'Monthly Visitors',
                            margin: 5,
                            layout: 'fit',
                            flex: 1,
                            items: [ this.monthlyVisitorsChart ]
                    } ),
                    Ext.create( 'Ext.panel.Panel', {
                            title: 'Monthly Order Value',
                            margin: 5,
                            layout: 'fit',
                            flex: 1,
                            items: [ this.monthlyOrderValueChart ]
                    } )
                ]
            } ),
            Ext.create( 'Ext.panel.Panel', {
                frame: false,
                border: false,
                margin: 5,
                flex: 1,
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [
                    Ext.create( 'Ext.panel.Panel', {
                            title: 'Top 3 Selling Products - Monthly',
                            margin: 5,
                            layout: 'fit',
                            flex: 1,
                            items: [ this.topMonthlySellingProductsChart ]
                    } ),
                    Ext.create( 'Ext.panel.Panel', {
                            title: 'Top 3 Post Codes - Monthly',
                            margin: 5,
                            layout: 'fit',
                            flex: 1,
                            items: [ this.topMonthlyPostCodesChart ]
                    } )
                ]
            } )
        ]
    } );
}


// Test charts.
FOBO.ui.prototype.dashboard.prototype.createCharts = function() {
    this.topMonthlyPostCodesChartStore = Ext.create( 'Ext.data.JsonStore', {
        fields: ['name', 'data'],
        autoLoad: true,
        proxy:{
            type:'rest',
            url:'/api/monthly-post-codes/',
            reader:{
                type: 'json',
                root:'data'
            }
        }
    } );

    this.topMonthlySellingProductsStore = Ext.create( 'Ext.data.JsonStore', {
        fields: ['name', 'data'],
        autoLoad: true,
        proxy:{
            type:'rest',
            url:'/api/monthly-selling-products/',
            reader:{
                type: 'json',
                root:'data'
            }
        }
    } );

    this.monthlyVisitorsStore = Ext.create( 'Ext.data.JsonStore', {
        fields: ['name', 'data'],
        autoLoad: true,
        proxy:{
            type:'rest',
            url:'/api/monthly-visitors/',
            reader:{
                type: 'json',
                root:'data'
            }
        }
    } );

    this.monthlyOrderValueStore = new Ext.data.JsonStore({
        fields: ['name', 'data'],
        autoLoad: true,
        proxy:{
            type:'rest',
            url:'/api/monthly-order-values/',
            reader:{
                type: 'json',
                root:'data'
            }
        }
    });

    this.topMonthlySellingProductsChart = new Ext.chart.Chart({
        animate: true,
        store: this.topMonthlySellingProductsStore,
        shadow: true,
        series: [{
            type: 'pie',
            animate: true,
            angleField: 'data', //bind angle span to visits
            highlight: {
                segment: {
                    margin: 20
                }
            },
            label: {
                field: 'name',   //bind label text to name
                display: 'rotate', //rotate labels (also middle, out).
                font: '14px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
                contrast: true
            },
            style: {
                'stroke-width': 1,
                'stroke': '#fff'
            }
        }]
    });

    this.topMonthlyPostCodesChart = new Ext.chart.Chart({
        animate: true,
        store: this.topMonthlyPostCodesChartStore,
        shadow: true,
        series: [{
            type: 'pie',
            animate: true,
            angleField: 'data', //bind angle span to visits
            highlight: {
                segment: {
                    margin: 20
                }
            },
            label: {
                field: 'name',   //bind label text to name
                display: 'rotate', //rotate labels (also middle, out).
                font: '14px "Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
                contrast: true
            },
            style: {
                'stroke-width': 1,
                'stroke': '#fff'
            }
        }]
    });

    this.monthlyVisitorsChart = new Ext.chart.Chart({
        animate: true,
        store: this.monthlyVisitorsStore,
        shadow: true,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name']
        }],
        series: [{
            type: 'column',
            axis: 'bottom',
            highlight: true,
            xField: 'name',
            yField: 'data'
        }]
    });

    this.monthlyOrderValueChart = new Ext.chart.Chart({
        animate: true,
        store: this.monthlyOrderValueStore,
        shadow: true,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name']
        }],
        series: [{
            type: 'column',
            axis: 'bottom',
            highlight: true,
            xField: 'name',
            yField: 'data'
        }]
    });
}