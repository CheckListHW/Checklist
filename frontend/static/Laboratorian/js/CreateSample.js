new Vue ({
    el: '#etaps',
    data: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

        lab_code: "",
        customer_code: "",
        customer: "",
        customer_id: -1,
        field: "",
        field_id: -1,
        well: "",
        well_id: -1,
        act_number: "",
        employee: {
            name: "",
            surname: "",
            patronymic: "",
        },
        note: "",

        year: -1,
        month: -1,
        date: -1,

        year_prob: -1,
        month_prob: -1,
        date_prob: -1,
    },
    mounted() {
        if(localStorage.lab_code) {
            this.lab_code = localStorage.lab_code;
        }
        if(localStorage.customer_code) {
            this.customer_code = localStorage.customer_code;
        }
        if(localStorage.customer) {
            this.customer = localStorage.customer;
        }
        if(localStorage.field) {
            this.field = localStorage.field;
        }
        if(localStorage.well) {
            this.well = localStorage.well;
        }
        if(localStorage.act_number) {
            this.act_number = localStorage.act_number;
        }
        if(localStorage.name) {
            this.employee.name = localStorage.name;
        }
        if(localStorage.surname) {
            this.employee.surname = localStorage.surname;
        }
        if(localStorage.patronymic) {
            this.employee.patronymic = localStorage.patronymic;
        }
        if(localStorage.note) {
            this.note = localStorage.note;
        }
    },
    watch: {
        customer_code(new_customer_code) {
            localStorage.customer_code = new_customer_code;
        },
        lab_code(new_lab_code) {
            localStorage.lab_code = new_lab_code;
        },
        customer(new_customer) {
            localStorage.customer = new_customer;
        },
        field(new_field) {
            localStorage.field = new_field;
        },
        well(new_well) {
            localStorage.well = new_well;
        },
        act_number(new_act_number) {
            localStorage.act_number = new_act_number;
        },
        note(new_note) {
            localStorage.note = new_note;
        },
        "employee.name"(new_name) {
            localStorage.name = new_name;
        },
        "employee.surname"(new_surname) {
            localStorage.surname = new_surname;
        },
        "employee.patronymic"(new_patronymic) {
            localStorage.patronymic = new_patronymic;
        },
        year(new_year) {
            localStorage.year = new_year;
        },
        month(new_month) {
            localStorage.month = new_month;
        },
        date(new_date) {
            localStorage.date = new_date;
        },
        year_prob(new_year_prob) {
            localStorage.year_prob = new_year_prob;
        },
        month_prob(new_month_prob) {
            localStorage.month_prob = new_month_prob;
        },
        date_prob(new_date_prob) {
            localStorage.date_prob = new_date_prob;
        },
    },
    computed: {
        control_check: function() {
            var false_indexes = [];

            if(this.lab_code != "") {
                false_indexes.push(true)
            }
            if(this.customer_code != "") {
                false_indexes.push(true)
            }
            if(this.customer != "") {
                false_indexes.push(true)
            }
            if(this.field != "") {
                false_indexes.push(true)
            }
            if(this.well != "") {
                false_indexes.push(true)
            }
            if(this.act_number != "") {
                false_indexes.push(true)
            }
            if(this.note != "") {
                false_indexes.push(true)
            }
            if(this.employee.name != "") {
                false_indexes.push(true)
            }
            if(this.employee.surname != "") {
                false_indexes.push(true)
            }
            if(this.employee.patronymic != "") {
                false_indexes.push(true)
            }

            if(false_indexes.length == 10 && false_indexes.indexOf(false) == -1) {
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        save: function(event) {

        },

        get_years: function () {
            var today = new Date();
            var count = 10;
            var start_year = today.getFullYear() - count;

            var array = Array(count + 1).fill().map((e, i) => i + start_year);

            return array;
        },

        get_dates: function (year, month) {
            var max_date = this.get_final_date(year, month);

            console.log(max_date);
            console.log(year);
            console.log(month);

            var array = Array(max_date).fill().map((e, i) => i + 1);

            return array;
        },

        modify: function () {
            this.date = this.get_final_date(this.year, this.month);
        },

        modify_prob: function () {
            this.date_prob = this.get_final_date(this.year_prob, this.month_prob);
        },

        get_final_date: function (year, month) {
            var date = new Date(year, month + 1, 0);
            return date.getDate();
        }
    },
    created: function() {
        localStorage.clear();
        var today = new Date();

        //Установление начальной даты для отбора

        if(localStorage.year) {
            this.year = localStorage.year;
        }
        else {
            this.year = today.getFullYear();
        }

        if(localStorage.month) {
            this.month = localStorage.month;
        }
        else {
            this.month = today.getMonth();
        }

        if(localStorage.date) {
            this.date = localStorage.date;
        }
        else {
            this.date = today.getDate();
        }

        //Установление начальной даты для приема

        if(localStorage.year_prob) {
            this.year_prob = localStorage.year_prob;
        }
        else {
            this.year_prob = today.getFullYear();
        }

        if(localStorage.month_prob) {
            this.month_prob = localStorage.month_prob;
        }
        else {
            this.month_prob = today.getMonth();
        }

        if(localStorage.date_prob) {
            this.date_prob = localStorage.date_prob;
        }
        else {
            this.date_prob = today.getDate();
        }
    }
})
