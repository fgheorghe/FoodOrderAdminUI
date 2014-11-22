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
                            items: [ this.chart3 ]
                    } ),
                    Ext.create( 'Ext.panel.Panel', {
                            title: 'Monthly Orders',
                            margin: 5,
                            layout: 'fit',
                            flex: 1,
                            items: [ this.chart4 ]
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
                            items: [ this.chart ]
                    } ),
                    Ext.create( 'Ext.panel.Panel', {
                            title: 'Top 3 Post Codes - Monthly',
                            margin: 5,
                            layout: 'fit',
                            flex: 1,
                            items: [ this.chart2 ]
                    } )
                ]
            } )
        ]
    } );
}


// Test charts.
FOBO.ui.prototype.dashboard.prototype.createCharts = function() {
    var food = [];
    for ( var i = 0; i <= 12; i++ ) {
        food.push( "Food Type" + i );
    }
    function generateData(n, months){
        var data = [],
            p = (Math.random() *  11) + 1,
            i;
        for (i = 0; i < (n || 12); i++) {
            data.push({
                name: months ? months[i] : food[i],
                data1: Math.floor(Math.max((Math.random() * 100), 20)),
                data2: Math.floor(Math.max((Math.random() * 100), 20)),
                data3: Math.floor(Math.max((Math.random() * 100), 20)),
                data4: Math.floor(Math.max((Math.random() * 100), 20)),
                data5: Math.floor(Math.max((Math.random() * 100), 20)),
                data6: Math.floor(Math.max((Math.random() * 100), 20)),
                data7: Math.floor(Math.max((Math.random() * 100), 20)),
                data8: Math.floor(Math.max((Math.random() * 100), 20)),
                data9: Math.floor(Math.max((Math.random() * 100), 20))
            });
        }
        return data;
    }
    function generateDataNegative(n){
        var data = [],
            p = (Math.random() *  11) + 1,
            i;
        for (i = 0; i < (n || 12); i++) {
            data.push({
                name: months ? months[i] : food[i],
                data1: Math.floor(((Math.random() - 0.5) * 100)),
                data2: Math.floor(((Math.random() - 0.5) * 100)),
                data3: Math.floor(((Math.random() - 0.5) * 100)),
                data4: Math.floor(((Math.random() - 0.5) * 100)),
                data5: Math.floor(((Math.random() - 0.5) * 100)),
                data6: Math.floor(((Math.random() - 0.5) * 100)),
                data7: Math.floor(((Math.random() - 0.5) * 100)),
                data8: Math.floor(((Math.random() - 0.5) * 100)),
                data9: Math.floor(((Math.random() - 0.5) * 100))
            });
        }
        return data;
    }

    var store2 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData(3, [ 'OX3', 'NW4', 'EX1' ] )
    });

    var store1 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData(3)
    });

    var store3 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData(false, Ext.Date.monthNames)
    });

    var store4 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData(false, Ext.Date.monthNames)
    });

    this.chart = new Ext.chart.Chart({
        animate: true,
        store: store1,
        shadow: true,
        series: [{
            type: 'pie',
            animate: true,
            angleField: 'data1', //bind angle span to visits
            lengthField: 'data2', //bind pie slice length to views
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
            },
            //add renderer
            renderer: function(sprite, record, attr, index, store) {
                var value = (record.get('data1') >> 0) % 9;
                var color = [ "#94ae0a", "#115fa6","#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"][value];
                return Ext.apply(attr, {
                    fill: color
                });
            }
        }]
    });

    this.chart2 = new Ext.chart.Chart({
        animate: true,
        store: store2,
        shadow: true,
        series: [{
            type: 'pie',
            animate: true,
            angleField: 'data1', //bind angle span to visits
            lengthField: 'data2', //bind pie slice length to views
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
            },
            //add renderer
            renderer: function(sprite, record, attr, index, store) {
                var value = (record.get('data1') >> 0) % 9;
                var color = [ "#94ae0a", "#115fa6","#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111"][value];
                return Ext.apply(attr, {
                    fill: color
                });
            }
        }]
    });

    this.chart3 = new Ext.chart.Chart({
        animate: true,
        store: store3,
        shadow: true,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data1'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: 'Number of Hits',
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Month of the Year'
        }],
        series: [{
            type: 'column',
            axis: 'bottom',
            highlight: true,
            xField: 'name',
            yField: 'data1'
        }]
    });

    this.chart4 = new Ext.chart.Chart({
        animate: true,
        store: store4,
        shadow: true,
        axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['data1'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: 'Number of Hits',
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Month of the Year'
        }],
        series: [{
            type: 'column',
            axis: 'bottom',
            highlight: true,
            xField: 'name',
            yField: 'data1'
        }]
    });
}