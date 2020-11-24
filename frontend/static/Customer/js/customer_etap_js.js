new Vue ({
    el: '#etaps',
    data: {
        prob_name: "Проба 131",

        plan_time: [700, 7000, 568, 12, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], //C БД
        fact_time: [10000, 1000, 1000, 1000, 10000, 1000, 10000, 1000, 1000, 1000, 1000, 10000, 1000], //C БД

        flag: [],
        hover: false,
        hover_index: -1,

        width_first: '',
        width_second: '',

        density_value: 0.523, //C БД
        velocity_value: 50, //C БД
        sulfur_value: 1.1, //C БД
        fractions_value: 67, //C БД
        asphalt_value: 13, //C БД
    },
    computed: {
    },
    methods: {
        sleep: function(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        },

        density: function() {
            var value = this.density_value;

            if(value > 0 && value <= 0.83) {
                return "Особо легкая";
            } if (value <= 0.85) {
                return "Легкая";
            } if (value <= 0.87) {
                return "Средняя";
            } if (value <= 0.895) {
                return "Тяжелая";
            } else {
                return "Битумиозная";
            }
        },

        velocity: function() {
            var value = this.velocity_value;

            if(value > 0 && value <= 5) {
                return "Незначительной вязкости";
            } if (value <= 10) {
                return "Маловязкая";
            } if (value <= 30) {
                return "Повышенной вязкости";
            } if (value <= 200) {
                return "Высоковязкая";
            } else {
                return "Сверхвязкая";
            }
        },

        sulfur: function() {
            var value = this.sulfur_value;

            if(value > 0 && value <= 0.6) {
                return "Малосернистая";
            } if (value <= 1.8) {
                return "Сернистая";
            } if (value <= 3.5) {
                return "Высокосернистая";
            } else {
                return "Особо высокосернистая";
            }
        },

        fractions: function() {
            var value = this.fractions_value;

            if(value > 0 && value < 25) {
                return "С низким содержанием светлых фракций";
            } if (value < 50) {
                return "Со средним содержанием светлых фракций";
            } if (value < 75) {
                return "С высоким содержанием светлых фракций";
            } else {
                return "С очень высоким содержанием светлых фракций";
            }
        },

        asphalt: function() {
            var value = this.asphalt_value;

            if(value > 0 && value <= 17) {
                return "Малосмолистые";
            } if (value <= 35) {
                return "Смолистые";
            } else {
                return "Высокосмолистые";
            }
        },

        hover_on: async function(index) {
            this.hover = !this.hover;
            this.hover_index = index;

            if(this.plan_time[index] > this.fact_time[index]) {
                this.width_first = '450';

                var difference = this.plan_time[index] / this.fact_time[index];
                var value = 450 / difference;

                this.width_second = String(value);
            }
            else {
                this.width_second = '450';

                var difference = this.fact_time[index] / this.plan_time[index];
                var value = 450 / difference;

                this.width_first = String(value);
            }
        },

        hover_off: function() {
            this.hover = !this.hover;
            this.hover_index = -1;
        }
    },
    components: {
        pretty_time: {
            props: ['value'],
            template: '<p>{{computed_time | prettify}}</p>',
            computed: {
                computed_time() {
                    var time = this.value / 60;
                    var minutes = parseInt(time);
                    var secondes = Math.round((time - minutes) * 60);
                    return minutes+":"+secondes;
                }
            },
            filters: {
                prettify : function(value) {
                    var data = value.split(':');
                    var minutes = data[0];
                    var secondes = data[1];
                    if (minutes < 10) {
                        minutes = "0"+minutes;
                    }
                    if (secondes < 10) {
                        secondes = "0"+secondes;
                    }
                    return minutes+":"+secondes;
                }
            }
        }
    },
    created: function() {
        for(var i = 0; i < this.plan_time.length; i++) {
            if(this.plan_time[i] < this.fact_time[i]) {
                this.flag.push(false);
            }
            else {
                this.flag.push(true);
            }
        }
    }
})

function Uniqe(array) {
    var result = [];
    var len = array.length;

    for(i = 0; i < len; i++) {
        if(!result.includes(array[i])) {
            result.push(array[i]);
        }
    }

    return result;
}

function FindCount(uniqe, data) {
    var result = [];
    var count = 0;
    var len = uniqe.length;

    for(i = 0; i < len; i++) {
        count = 0;

        for(j = 0; j < data.length; j++) {
            if(uniqe[i] == data[j]) {
                count += 1;
            }
        }

        result.push(count);
    }

    return result;
}

function FillColor(array) {
    var result = [];

    for(j = 0; j < array.length; j++) {
        result.push('rgb(77, 77, 77)');
    }

    return result;
}

// First Graphic

var ctx = document.getElementById('myChart');
var data_density = [7, 6, 7, 10, 3, 2, 2, 3, 2, 4, 2, 4, 1, 4, 2, 5, 8, 3, 9, 3, 3, 10, 1, 10, 4, 4, 9, 3, 8, 4, 9, 4, 7, 3, 4, 2, 10, 2, 8, 8, 7, 3, 7, 10, 6, 2, 3, 10, 10, 2] //C БД

var uniqe_data_density = Uniqe(data_density).sort( (a, b) => a - b );

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: uniqe_data_density,
        datasets: [{
            data: FindCount(uniqe_data_density, data_density),
            backgroundColor: FillColor(uniqe_data_density),
        }]
    },
    options: {
        legend: {
            display: false,
        }
    }
});

var density_value = 5; //C БД
var index = uniqe_data_density.findIndex(item => item == density_value);
myChart.chart.config.data.datasets[0].backgroundColor[index] = "rgb(85, 160, 255)";
myChart.update();

// Second Graphic

var ctx1 = document.getElementById('myChart1');
var data_viscosity = [87, 100, 36, 41, 82, 20, 1, 65, 13, 37, 24, 8, 79, 96, 15, 77, 64, 10, 10, 67, 61, 90, 99, 36, 23, 2, 76, 68, 21, 55, 39, 43, 70, 69, 3, 65, 18, 75, 70, 75, 58, 25, 53, 15, 3, 95, 23, 100, 38, 81] //C БД

var uniqe_data_viscosity = Uniqe(data_viscosity).sort( (a, b) => a - b );

var myChart1 = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: uniqe_data_viscosity,
        datasets: [{
            data: FindCount(uniqe_data_viscosity, data_viscosity),
            backgroundColor: FillColor(uniqe_data_viscosity),
        }]
    },
    options: {
        legend: {
            display: false,
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                }
            }],
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 5,
                    minRotation: 0,
                    maxRotation: 0,
                    stepSize: 20,
                    max: 100,
                    min: 0,
                }
            }]
        }
    }
});

var viscosity_value = 39; //C БД
var index = uniqe_data_viscosity.findIndex(item => item == viscosity_value);
myChart1.chart.config.data.datasets[0].backgroundColor[index] = "rgb(85, 160, 255)";
myChart1.update();

// Fird Graphic

var ctx2 = document.getElementById('myChart2');
var data_sulfur = [7, 6, 7, 10, 3, 2, 2, 3, 2, 4, 2, 4, 1, 4, 2, 5, 8, 3, 9, 3, 3, 10, 1, 10, 4, 4, 9, 3, 8, 4, 9, 4, 7, 3, 4, 2, 10, 2, 8, 8, 7, 3, 7, 10, 6, 2, 3, 10, 10, 2] //C БД

var uniqe_data_sulfur = Uniqe(data_sulfur).sort( (a, b) => a - b );

var myChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: uniqe_data_sulfur,
        datasets: [{
            data: FindCount(uniqe_data_sulfur, data_sulfur),
            backgroundColor: FillColor(uniqe_data_density),
        }]
    },
    options: {
        legend: {
            display: false,
        }
    }
});

var sulfur_value = 1; //C БД
var index = uniqe_data_sulfur.findIndex(item => item == sulfur_value);
myChart2.chart.config.data.datasets[0].backgroundColor[index] = "rgb(85, 160, 255)";
myChart2.update();
