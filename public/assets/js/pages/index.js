
$(function () {
    getMorris('area', 'area_chart');
    getMorris('donut', 'donut_chart');
});

function getMorris(type, element) {
    if (type === 'area') {
        Morris.Area({
            element: element,
            data: [{
                period: '2017 Q2',
                Sales: 3480,
                Revenue: 2102,
                Monthly: 2365
            }, {
                    period: '2010 Q1',
                    Sales: 4912,
                    Revenue: 1969,
                    Monthly: 2501
                }, {
                    period: '2011 Q2',
                    Sales: 2145,
                    Revenue: 1245,
                    Monthly: 1212
                }, {
                    period: '2012 Q3',
                    Sales: 2356,
                    Revenue: 2548,
                    Monthly: 3496
                },{
                    period: '2013 Q4',
                    Sales: 3767,
                    Revenue: 3597,
                    Monthly: 4512
                }, {
                    period: '2014 Q4',
                    Sales: 5148,
                    Revenue: 1914,
                    Monthly: 2293
                }, {
                    period: '2015 Q4',
                    Sales: 5124,
                    Revenue: 3451,
                    Monthly: 6124
                },{
                    period: '2016 Q2',
                    Sales: 4215,
                    Revenue: 4460,
                    Monthly: 2028
                }, {
                    period: '2017 Q2',
                    Sales: 6412,
                    Revenue: 5713,
                    Monthly: 3450
                }],
            xkey: 'period',
            ykeys: ['Sales', 'Revenue', 'Monthly'],
            labels: ['Sales', 'Revenue', 'Monthly'],
            pointSize: 3,
            hideHover: 'auto',
            lineColors: ['#ffc0cb', '#add8e6', '#d9c3f5']
        });
    } else if (type === 'donut') {
        Morris.Donut({
            element: element,
            data: [{
                label: 'Crome',
                value: 25
            }, {
                    label: 'Mozila',
                    value: 40
                }, {
                    label: 'Safari',
                    value: 15
                },{
                    label: 'IE',
                    value: 20
                }, {
                    label: 'Other',
                    value: 10
                }],
            colors: ['rgb(0,189,209)', 'rgb(137,197,75)', 'rgb(27,138,207)', 'rgb(168,104,224)', 'rgb(255,200,0)'],
            formatter: function (y) {
                return y + '%'
            }
        });
    }
}
