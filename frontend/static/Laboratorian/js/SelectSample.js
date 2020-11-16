var sortByLabCode = function (d1, d2) {return (d1.lab_code > d2.lab_code) ? 1 : -1;};
var sortByСustomerСode = function (d1, d2) {return (d1.customer_code.toLowerCase() > d2.customer_code.toLowerCase()) ? 1 : -1; };
var sortByDataEntrance = function (d1, d2) {return (d1.data_entrance > d2.data_entrance) ? 1 : -1; };

Vue.component('probs_list', {
    props: ['prob', 'index'],
    template: `<tr @click="choose(index)">
                    <td>{{prob.id}}</td>
                    <td>{{prob.lab_code}}</td>
                    <td>{{prob.customer_code}}</td>
                    <td>{{prob.customer}}</td>
                    <td>{{prob.field}}</td>
                    <td>{{prob.well}}</td>
                    <td>{{prob.data_selection}}</td>
                    <td>{{prob.act_number}}</td>
                    <td>{{prob.data_entrance}}</td>
                    <td>{{employee_string(prob.employee)}}</td>
                    <td>{{prob.note}}</td>
                </tr>`,
    methods: {
        choose: function(index) {
            this.$emit('choose_prob', index);
        },

        employee_string: function(employee) {
            var result = "";

            result += employee.surname + " ";
            result += employee.name[0] + ". ";
            result += employee.patronymic[0] + ".";

            return result;
        },

        data_format: function(data) {
            return Intl.DateTimeFormat('ru').format(data);
        }
    }
});

new Vue ({
    el: '#etaps',
    data: {
        probs: [], //Взято с БД

        sort_rules: [
            {key: 'lab_code:asc', title: 'Возрастание лаб. шифра'},
            {key: 'lab_code:desc', title: 'Убывание лаб. шифра'},
            {key: 'customer_code:asc', title: 'Возрастание шифра зак.'},
            {key: 'customer_code:desc', title: 'Убывание шифра зак.'},
            {key: 'data_entrance:asc', title: 'Возрастание даты принятия'},
            {key: 'data_entrance:desc', title: 'Убывание даты принятия'},
        ],
        select_sort: "lab_code:asc",

        customers: [],
        fields: [],
        wells: [],
        select_customer: 0,
        select_field: 0,
        select_well: 0,
    },
    computed: {
        filtered_probs: function () {
            var filtered = this.probs
                .filter(probs => {
                    return this.select_customer == 0 || probs.customer_id == this.select_customer;
                })

                .filter(probs => {
                    return this.select_field == 0 || probs.field_id == this.select_field;
                })

                .filter(probs => {
                    return this.select_well == 0 || probs.well_id == this.select_well;
                });

            var sorted = [];

            switch (this.sort_key) {
                case 'lab_code':
                    sorted = filtered.sort(sortByLabCode);
                    break
                case 'customer_code':
                    sorted = filtered.sort(sortByСustomerСode);
                    break
                case 'data_entrance':
                    sorted = filtered.sort(sortByDataEntrance);
                    break
            }

            if (this.sort_dir == 'desc') {
                sorted = sorted.reverse();
            }

            return sorted;
        },

        sort_key: function () {
            return this.select_sort.split(':')[0];
        },

        sort_dir: function () {
            return this.select_sort.split(':')[1];
        },
    },
    methods: {
        unique: function (array) {
            var result = [];
            var len = array.length;

            for (i = 0; i < len; i++) {
                if (!result.includes(array[i])) {
                    result.push(array[i]);
                }
            }

            return result;
        },

        find_customer_id: function (name) {
            var customer = this.customers.find(customer => customer.name == name);
            return customer.id;
        },

        find_field_id: function (name) {
            var field = this.fields.find(field => field.name == name);
            return field.id;
        },

        find_well_id: function (name) {
            var well = this.wells.find(well => well.name == name);
            return well.id;
        },

        choose_etap: function (index) {
            this.etap = this.etaps[index];
            this.button_visible = !this.button_visible;
        },

        choose_prob: function (index, prob) {
            window.location.href = '/lab/stages/?Sample=' + prob.id
        },

         Prepare: function (index, prob) {
            window.location.href = '/lab/preparatory/?ExeStage=-1'
        }
    },
    created: async function () {
        const vm = this;
        let samples = await axios.get('/api/samples/');
        samples.data.forEach(function (sample) {
            vm.probs.push({
                lab_code: 131,
                id: sample.id,
                customer_code: sample.CustomerCode,
                customer: sample.Customer,
                customer_id: -1,
                field: sample.Deposit,
                field_id: -1,
                well: sample.WellNumber,
                well_id: -1,
                data_selection: sample.WellNumber,
                act_number: sample.ActNumber,
                data_entrance: sample.ReceiptDate,
                employee: {
                    name: sample.LabName,
                    surname: sample.LabSurname,
                    patronymic: sample.LabPatronymic,
                },
                note: sample.Comment,
            })
        })
        var len = vm.probs.length;

        //Создаем массив всех заказчиков
        var array = [];
        for (i = 0; i < len; i++) {
            array.push(vm.probs[i].customer)
        }
        array = vm.unique(array);

        for (i = 1; i < array.length + 1; i++) {
            var customer = {
                id: i,
                name: array[i - 1],
            }
            vm.customers.push(customer)
        }

        for (i = 0; i < len; i++) {
            vm.probs[i].customer_id = vm.find_customer_id(vm.probs[i].customer);
        }
        //==================================================

        //Создаем массив всех месторождений
        var array = [];
        for (i = 0; i < len; i++) {
            array.push(vm.probs[i].field)
        }
        array = vm.unique(array);

        for (i = 1; i < array.length + 1; i++) {
            var field = {
                id: i,
                name: array[i - 1],
            }
            vm.fields.push(field)
        }

        for (i = 0; i < len; i++) {
            vm.probs[i].field_id = vm.find_field_id(vm.probs[i].field);
        }
        //==================================================

        //Создаем массив всех скважин
        var array = [];
        for (i = 0; i < len; i++) {
            array.push(vm.probs[i].well)
        }
        array = vm.unique(array);

        for (i = 1; i < array.length + 1; i++) {
            var well = {
                id: i,
                name: array[i - 1],
            }
            vm.wells.push(well)
        }

        for (i = 0; i < len; i++) {
            vm.probs[i].well_id = vm.find_well_id(vm.probs[i].well);
        }
    }
    //==================================================
})