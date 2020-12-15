new Vue ({
    el: '#etaps',
    data: {
        prob_name: "Проба 131",

        plan_time: [500, 1000, 1000, 1000, 10000, 1000, 1000, 1000, 1000, 1000, 1000, 10000, 1000, 700, 7000, 568, 1200, 1000, 1000, 10000, 100, 1000, 10, 10000, 1000, 1000, 1000, 1000, 1000, 1000, 10000, 1000, 700, 700, 568, 12, 1000, 1000], //C БД
        fact_time: [10000, 1000, 1000, 1000, 10000, 1000, 10000, 1000, 1000, 1000, 1000, 10000, 1000, 700, 7000, 568, 12, 1000, 1000, 10000, 1000, 1000, 1000, 10000, 1000, 10000, 1000, 1000, 1000, 1000, 10000, 1000, 700, 7000, 568, 12, 1000, 1000], //C БД

        plan_times_arrays: [],
        fact_times_arrays: [],
        flags_arrays: [],
        title_lens: [],

        flag: [],
        hover: false,
        hover_index: -1,
        hover_number: -1,

        width_first: '',
        width_second: '',

        density_value: 0.750, //C БД
        density_value_2: 0.730, //C БД
        device_vlue: 1, //C БД 1 или 2 зависит от выбора варианта в начале
        temperature: 25, //C БД
        fractions_value: 67, //C БД
        asphalt_value: 13, //C БД

        max_size: 19,
        block_height: -1,
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

        device: function() {
            var value = this.device_vlue;

            if(value == 1) {
                return "C помощью ареометра";
            } else {
                return "C помощью пикнометра";
            }
        },

        hover_on: async function(index, number) {
            this.hover = !this.hover;
            this.hover_index = index;
            this.hover_number = number;

            if(this.plan_times_arrays[index][number] > this.fact_times_arrays[index][number]) {
                this.width_first = '450';

                var difference = this.plan_times_arrays[index][number] / this.fact_times_arrays[index][number];
                var value = 450 / difference;

                this.width_second = String(value);
            }
            else {
                this.width_second = '450';

                var difference = this.fact_times_arrays[index][number] / this.plan_times_arrays[index][number];
                var value = 450 / difference;

                this.width_first = String(value);
            }
        },

        hover_off: function() {
            this.hover = !this.hover;
            this.hover_index = -1;
            this.hover_number = -1;
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
        var count;

        if(this.plan_time.length > this.max_size) {
            if(this.plan_time.length % this.max_size == 0) {
                count = this.plan_time.length / this.max_size;
            } else {
                count = this.plan_time.length / this.max_size + 1;
            }
        }

        var array1 = [];
        var array2 = [];
        var array3 = [];

        for(var i = 1; i < this.plan_time.length + 1; i++) {
            if(i % (this.max_size + 1) == 0) {
                console.log("sdfsdfsdfsdf")
                this.plan_times_arrays.push(array1);
                this.fact_times_arrays.push(array2);
                this.flags_arrays.push(array3);
                this.title_lens.push(this.max_size);

                array1 = [];
                array2 = [];
                array3 = [];
            }

            array1.push(this.plan_time[i-1]);
            array2.push(this.fact_time[i-1]);

            if(this.plan_time[i-1] < this.fact_time[i-1]) {
                array3.push(false);
            }
            else {
                array3.push(true);
            }
        }

        if(array1.length > 0) {
            this.plan_times_arrays.push(array1);
            this.fact_times_arrays.push(array2);
            this.flags_arrays.push(array3);
            this.title_lens.push(i % (this.max_size + 1));
        }

        this.block_height = String(document.documentElement.clientHeight - 328 - count * 116);
        console.log(this.block_height)
    }
})
