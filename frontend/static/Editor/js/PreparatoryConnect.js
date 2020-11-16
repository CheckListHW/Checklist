new Vue ({
    el: '#etap',
    data: {
        etap_name: "Приемка нефти", // Взято с прошлой страницы
        Experiment:JSON.parse(document.getElementById('Experiment').textContent),
        stg: JSON.parse(document.getElementById('Stage').textContent),
        exp: JSON.parse(document.getElementById('Experiment').textContent),

        tasks: [],
        input_value: "",

        link_visibles: [false, false],
        extra_etaps: [ ],//Это из БД грузится полностью, я только имя взял
        choosen_extra_etaps: [], //После перехода на то место где не было выбрано подгтовительного этапа надо ставить null чтоб сохранилась привязка, но вроде и так ставится само, надо проверить будет на всякий
        choosen_extra_etap: {},
    },
    methods: {
        add_new: function(array) {
            var task = {
                name:this.input_value,
                extra_etap: null,
            }
            array.push(task);
            this.input_value = "";
            this.link_visibles.push(false);
        },

        delete_item: function(array, index) {
            array.splice(index, 1);
            this.choosen_extra_etaps.splice(index, 1);
        },

        choosen: function(item, index) {
            console.log(this.choosen_extra_etaps[index]);
            if(this.choosen_extra_etaps[index] == null) {
                return false;
            }
            else {
                if(this.choosen_extra_etaps[index].name == item.name) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        ok: function(index) {
            Vue.set(this.choosen_extra_etaps, index, this.choosen_extra_etap);
            Vue.set(this.link_visibles, index, !this.link_visibles[index]);
            this.tasks[index].extra_etap = this.choosen_extra_etap.id;
            this.tasks[index].PreStage = this.choosen_extra_etap.name;
            this.choosen_extra_etap = {};
        },

        change_link_visible: function(index) {
            Vue.set(this.link_visibles, index, !this.link_visibles[index]);
        },

        back: function(index) {
            Vue.set(this.link_visibles, index, !this.link_visibles[index]);
        },

        Stuff: function(){
            axios.post('crud/', {Experiment:this.exp, Stage: this.stg, array: this.tasks})
            window.location.href = '/stages/stuffs/?Stage=' + this.stg;
        },

        finish: function(){
            axios.post('crud/', {Experiment:this.exp, Stage: this.stg, array: this.tasks})
            window.location.href = '/stages/sub/?Stage=' + this.stg;
        },
    },
    created: async function () {
        const vm = this;
        json = await axios.get('/api/paragraphs/?Stage=' + vm.stg)
        json.data.forEach(function (item) {
            vm.tasks.push({
                name:item.Name,
                extra_etap: item.PreparatoryStage,
                PreStage: ' | '+item.PreparatoryStageName,
                Number: item.Number,

            })
        })
        response = await axios.get('/api/stage/?Experiment='+vm.Experiment)
        response.data.forEach(function (item) {
            if (item.PreparatoryStage == true)
            {
                vm.extra_etaps.push({
                    name: item.Name,
                    id: item.id,
                    Number: item.Number,
                })
            }
        })
    }
})
