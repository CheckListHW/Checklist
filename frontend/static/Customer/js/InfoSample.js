new Vue ({
    el: '#etaps',
    data: {
        Sample: JSON.parse(document.getElementById('Sample').textContent),
        prob_name: "Проба 131",

        plan_time: [700, 7000, 568, 12, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000], //C БД
        fact_time: [800, 1000, 1000, 1000, 10000, 100, 10000, 1000, 1000, 1000, 1000, 10000, 1000], //C БД

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

    methods: {
        back: function(){
            window.location.href = '/customer/samples/';
        },

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

    created: async function() {

        const vm = this;
        vm.plan_time = []
        vm.fact_time = []
        let ExeExpirement = await axios.get('/api/exeexperiment/?Samples='+vm.Sample)
        let ExeStage = await axios.get('/api/exestage/?ExeExperiment='+ExeExpirement.data[0].id+'&'+'PreparatoryStage=0')

        for(let i = 0; i < ExeStage.data.length; i++){
            ExeSubStages = (await axios.get('/api/exesubstage/?ExeStage='+ExeStage.data[i].id+'&'+'Check=True')).data
            let Duration = 0;
            let Runtime = 0;
            let densitySubStage = null;
            for(let i = 0; i < ExeSubStages.length; i++){

                if (ExeSubStages[i].Duration != null){
                    Duration += ExeSubStages[i].Duration
                    Runtime += ExeSubStages[i].Runtime
                }

                if (ExeSubStages[i].SubStage == 830 || ExeSubStages[i].SubStage == 868){
                    let density = (await axios.get('/api/execalcparameters/?ExeSubStage='+ExeSubStages[i].id)).data
                    vm.density_value = density[0].Value
                    console.log(density)
                    console.log(vm.density_value)
                }

                if (ExeSubStages[i].SubStage == 1048){
                    let velocity = (await axios.get('/api/execalcparameters/?ExeSubStage='+ExeSubStages[i].id)).data
                    vm.velocity_value = velocity[0].Value
                    console.log(velocity)
                    console.log(vm.density_value)
                }

                if (ExeSubStages[i].SubStage == 886){
                    let sulfur = (await axios.get('/api/execalcparameters/?ExeSubStage='+ExeSubStages[i].id)).data
                    vm.sulfur_value = sulfur[0].Value
                    console.log(sulfur)
                    console.log(vm.sulfur_value)
                }

                if (ExeSubStages[i].SubStage == 1031 || ExeSubStages[i].SubStage == 1032){
                    let asphalt = (await axios.get('/api/execalcparameters/?ExeSubStage='+ExeSubStages[i].id)).data
                    vm.asphalt_value = asphalt[0].Value
                    console.log(asphalt)
                    console.log(vm.asphalt_value)
                }

            }




            //vm.density_value



            vm.plan_time.push(Duration*60)
            vm.fact_time.push(Runtime)
            //vm.fact_time.push(Duration*60*(Math.random()/10+0.95))





        }

        let deviation = 0.1
        for(var i = 0; i < this.plan_time.length; i++) {
            if(this.plan_time[i] < this.fact_time[i]*(1-deviation) || this.plan_time[i] > this.fact_time[i]*(1+deviation)) {
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

function GenerateLabels(array, shag, round) {
    var result = [];
    var max = Math.max.apply(null, array);
    var min = Math.min.apply(null, array);

    for(min; min < max; min += shag) {
        result.push(min.toFixed(round));
    }
    result.push(min.toFixed(round))

    return result;
}

function GetLabelsCount(array, shag, round) {
    var result = [];
    var labels = GenerateLabels(array, shag, round);
    var max = Math.max.apply(null, labels);
    var min = Math.min.apply(null, labels);

    for(var i = 0; i < labels.length - 1; i++) {
        var count = 0;

        for(var j = 0; j < array.length; j++) {
            if((array[j] <= labels[i+1]) && (array[j] >= labels[i])) {
                count++;
            }
        }
        result.push(count);
    }

    return result;
}

function GetLabelsValue(value, array) {
    for(var i = 0; i < array.length - 1; i++) {
        if((array[i] <= value) && (value <= array[i + 1])) {
            return array[i];
        }
    }
}

// First Graphic

var ctx = document.getElementById('myChart');

var data_density = [835.0, 835.0, 831.0, 831.0, 817.0, 817.0, 827.0, 827.0, 827.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 820.0, 839.0, 852.0, 850.0, 844.0, 845.0, 815.0, 876.0, 815.0, 876.0, 836.0, 824.0, 824.0, 825.0, 825.0, 825.0, 825.0, 849.2, 845.5, 842.6, 831.4, 825.6, 825.8, 837.6, 838.2, 840.4, 841.5, 835.0, 836.2, 834.4, 853.2, 850.8, 850.4, 850.0, 850.0, 849.0, 849.0, 849.0, 849.0, 847.0, 849.0, 849.0, 849.0, 834.0829135, 834.4994267, 834.7888877, 849.3875268, 849.1940668, 849.1778508, 848.7372208, 849.3824023, 848.7720996, 866.1, 816.0, 815.0, 815.0, 868.0, 866.0, 868.0, 867.0, 866.1, 826.8, 868.6, 867.1, 800.3, 814.3, 814.3, 814.9, 805.6, 806.0, 807.0, 810.2, 809.8, 809.9, 825.4, 825.3, 825.7, 830.1, 830.6, 821.7, 820.1, 820.4, 826.2, 817.0, 816.0, 817.0, 816.0, 828.0, 828.0, 829.0, 817.1, 817.2, 816.5, 833.2, 833.1, 834.3, 827.2, 827.7, 823.4, 820.3, 818.7, 832.0, 832.0, 826.8, 792.0, 808.7, 811.4, 821.7, 820.1, 820.4, 826.2, 817.8, 824.5, 824.7, 823.9, 825.3, 825.0, 825.4, 823.7, 823.1, 823.5, 808.0, 836.0, 836.0, 836.0, 821.0, 821.0, 841.0, 841.0, 840.0, 841.0, 815.0, 819.0, 819.0, 826.0, 826.0, 828.0, 827.0, 828.0, 833.0, 835.0, 831.0, 830.0, 831.0, 828.0, 780.0, 810.0, 806.0, 807.0, 828.0, 828.0, 827.0, 820.0, 820.0, 821.0, 831.0, 831.0, 832.0, 832.0, 833.0, 832.0, 828.0, 829.0, 828.0, 829.0, 829.0, 829.0, 824.0, 825.0, 824.0, 826.0, 827.0, 826.0, 814.0, 815.0, 832.0, 832.0, 832.0, 827.0, 827.0, 841.0, 841.0, 841.0, 836.0, 836.0, 837.0, 838.0, 831.0, 837.0, 800.3, 814.3, 814.3, 814.9, 805.6, 806.0, 807.0, 810.2, 809.8, 809.9, 825.4, 825.3, 825.7, 830.1, 822.9, 817.2, 819.4, 850.0, 850.0, 845.0, 842.0, 845.0, 842.0, 842.1, 842.5, 842.4, 855.6, 855.0, 845.0, 845.0, 856.0, 855.0, 855.0, 855.0, 854.0, 854.0, 854.0, 851.0, 851.0, 844.0, 844.0, 844.0, 844.0, 857.2, 850.5, 851.0, 853.0, 856.0, 852.0, 846.0, 846.0, 846.0, 843.0, 843.0, 842.0, 839.0, 839.0, 840.0, 844.4, 844.3, 841.0, 832.3, 819.0, 816.2, 816.8, 823.9, 823.6, 833.0, 831.0, 833.0, 828.0, 829.4, 829.6, 794.0, 795.0, 810.0, 810.0, 795.0, 795.0, 801.0, 801.0, 800.0, 800.0, 800.0, 800.0, 843.5, 824.3, 825.4, 825.1, 820.6, 820.0, 819.8, 828.0, 829.0, 826.0, 840.0, 820.0, 835.0, 819.0, 830.0, 816.0, 818.0, 814.0, 825.0, 825.0, 792.0, 801.0, 805.0, 790.0, 801.0, 842.0, 840.0, 838.0, 829.0, 833.0, 829.0, 818.0, 831.0, 837.0, 831.0, 833.0, 812.0, 823.0, 820.0, 820.0, 810.0, 810.0, 816.0, 816.0, 838.0, 837.0, 837.0, 838.0, 838.0, 837.0, 831.0, 802.0, 827.5, 827.6, 828.0, 855.2, 854.3, 789.9, 799.0, 821.9, 822.3, 822.6, 821.2, 821.5, 821.7, 822.1, 823.2, 821.15, 829.39, 826.57, 824.86, 829.39, 826.57, 824.86, 828.0, 828.0, 832.0, 801.0, 797.0, 805.0, 820.0, 820.0, 841.0, 846.0, 845.0, 855.6, 854.7, 854.1, 839.0, 839.0, 838.0, 837.0, 840.0, 837.0, 840.0, 840.0, 839.0, 833.6, 831.6, 834.4, 835.1, 835.6, 835.4, 836.0, 834.8, 836.2, 821.3, 820.9, 820.1, 832.2, 841.0, 846.0, 845.0, 855.6, 854.7, 854.1, 839.0, 839.0, 838.0, 837.0, 840.0, 837.0, 840.0, 840.0, 839.0, 833.6, 831.6, 834.4, 835.1, 835.6, 835.4, 836.0, 834.8, 836.2, 821.3, 820.9, 820.1, 803.0, 840.0, 839.0, 837.0, 838.0, 909.0, 909.0, 907.0, 903.0, 830.0, 827.0, 828.0, 820.0, 820.0, 821.0, 791.5, 812.0, 818.0, 811.0, 820.0, 820.0, 821.0, 820.0, 820.0, 802.0, 811.0, 816.0, 830.0, 827.0, 828.0, 827.0, 827.0, 827.0, 820.0, 820.0, 821.0, 812.0, 812.0, 810.0, 811.0, 818.0, 812.0, 816.0, 811.0, 816.0, 802.0, 825.0, 825.0, 825.0, 826.3, 826.1, 825.9] //C БД

var uniqe_data_density = Uniqe(data_density).sort( (a, b) => a - b );
var density_shag = 5;
var labels_density = GenerateLabels(uniqe_data_density, density_shag, 0);

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels_density,
        datasets: [{
            data: GetLabelsCount(uniqe_data_density, density_shag, 0),
            backgroundColor: FillColor(uniqe_data_density),
        }]
    },
    options: {
        legend: {
            display: false,
        }
    }
});

var density_value = 836.0; //C БД
var density_label_value = GetLabelsValue(density_value, labels_density)
var index = labels_density.findIndex(item => item == density_label_value);
myChart.chart.config.data.datasets[0].backgroundColor[index] = "rgb(85, 160, 255)";
myChart.update();

// Second Graphic

var ctx1 = document.getElementById('myChart1');
var data_viscosity = [5.58, 5.58, 4.22, 4.22, 3.8, 3.69, 4.24, 2.26, 2.26, 2.8, 2.8, 2.8, 2.8, 2.8, 2.69, 2.69, 2.69, 2.69, 2.69, 2.69, 2.69, 2.69, 8.72, 6.16, 5.84, 5.66, 5.47, 4.84, 27.63, 4.84, 27.63, 3.22, 2.62, 3.0, 2.75, 2.75, 2.75, 2.75, 0.401, 0.413, 0.612, 0.6, 0.52, 0.528, 0.515, 0.455, 0.466, 0.591, 0.561, 0.649, 0.65, 0.587, 0.608, 0.6, 0.6, 0.58, 0.61, 0.6, 0.54, 0.56, 0.60993639, 0.614091374, 0.593055476, 0.621984124, 0.593021154, 0.608075437, 0.610835937, 0.655298406, 0.590207771, 29.02, 2.29, 2.28, 2.28, 2.28, 1.64, 1.64, 1.64, 1.96, 1.9, 1.96, 3.765, 3.746, 3.862, 4.11, 4.969, 2.59, 2.56, 2.56, 4.63, 2.82, 2.15, 2.88, 2.7, 5.589, 5.261, 5.5, 5.31, 5.42, 5.18, 4.87, 4.83, 4.987, 4.83, 4.619, 1.77, 3.68, 3.72, 2.59, 2.56, 2.56, 4.63, 3.13, 4.47, 4.47, 4.47, 4.58, 4.58, 4.58, 4.29, 4.29, 4.29, 46.97, 34.89, 13.2, 15.88, 14.96, 17.8, 23.11, 41.24, 37.53, 51.63, 46.48, 68.65, 15.75, 20.75, 58.03, 59.77, 60.12, 67.55, 66.92, 23.88, 14.04, 13.9, 13.77, 14.11, 13.99, 13.69, 15.26, 15.16, 15.31, 13.11, 13.46, 13.34, 18.8, 18.16, 18.4, 15.95, 16.18, 16.11, 31.35, 33.19, 15.0, 15.0, 34.69, 28.0, 20.49, 20.57, 20.3, 15.06, 15.29, 15.5, 2.29, 2.28, 2.28, 2.28, 1.64, 1.64, 1.64, 1.96, 1.9, 1.96, 3.77, 3.75, 3.86, 4.11, 2.74, 2.48, 2.58, 5.83, 8.22, 7.05, 9.31, 6.67, 6.9, 5.73, 4.84, 10.65, 4.95, 4.93, 4.67, 4.71, 3.67, 4.41, 3.42, 5.17, 7.91, 3.653, 3.86, 2.43, 2.27, 2.17, 2.1, 3.31, 3.31, 3.31, 3.27, 3.27, 3.27, 3.25, 3.36, 3.06, 4.61, 4.49, 4.01, 4.61, 4.49, 4.01, 4.45, 5.48, 5.44, 5.01, 4.03, 3.96, 3.82, 3.256, 3.132, 3.429, 3.44, 3.448, 3.444, 2.92, 2.8, 2.72, 4.83, 4.45, 5.48, 5.44, 5.01, 4.03, 3.96, 3.82, 3.256, 3.132, 3.429, 3.44, 3.448, 3.444, 2.92, 2.8, 2.72, 5.68, 5.68, 5.68] //C БД

var uniqe_data_viscosity = Uniqe(data_viscosity).sort( (a, b) => a - b );
var viscosity_shag = 3;
var labels_viscosity = GenerateLabels(uniqe_data_viscosity, viscosity_shag, 1);

var myChart1 = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: labels_viscosity,
        datasets: [{
            data: GetLabelsCount(uniqe_data_viscosity, viscosity_shag, 1),
            backgroundColor: FillColor(uniqe_data_viscosity),
        }]
    },
    options: {
        legend: {
            display: false,
        },
    }
});

var viscosity_value = 6; //C БД
var viscosity_label_value = GetLabelsValue(viscosity_value, labels_viscosity)
var index = labels_viscosity.findIndex(item => item == viscosity_label_value);
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
