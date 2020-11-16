new Vue ({
    el: '#etap',
    data: {
        etap_name: "Приемка нефти", // Взято с прошлой страницы

        message: "",
        message_visible: false,
        stg: JSON.parse(document.getElementById('Stage').textContent),
        exp: JSON.parse(document.getElementById('Experiment').textContent),
        tasks: [],
        input_value: "",

    },
    methods: {
        add_new: function(array) {
            array.push(this.input_value);
            this.input_value = "";
        },

        delete_item: function(array, index) {
            array.splice(index, 1);
        },
        finish: function(array){
            const vm = this;
            axios.post('crud/', {Experiment:vm.exp, Stage: vm.stg, array: array, risks: vm.message}).then(res => {
                console.log(res); // Результат ответа от сервера
            })
        },
        change_visibles: function(index) {
            Vue.set(this.input_visibles, index, !this.input_visibles[index]);
        }
    },
    created: function () {
        const vm = this;
        axios.get('/api/paragraphs/?Stage=' + vm.stg)
            .then(function (response) {
                json=response.data;
                json.forEach(function (item, i, jsonname) {
                    vm.tasks.push(item.Name)
                })
            });
        axios.get('/api/stage/?id=' + vm.stg)
            .then(function (response) {
            vm.message=response.data[0].Risks;
        })
    }
})
