Vue.component ('experiment_button', {
    props: ["name", "index", "number","expname","id"],
      data: function() {
        return {
            oldd: '22',
        }
    },
    template:  `<div class="experiment">    
                    <table>
                        <td>
                            <button class="btn btn-info experiment_btn" @click="Stage(id)"> {{buttonName(number,expname)}} </button>
                        </td>
                        <td>
                            <button class="btn btn-danger" @click="onDeleteButton(id, index)">X</button>
                            <span v-if="number==null" class="hidden">{{buttonName(number, name)}}</span>
                            <span v-else class="hidden">{{buttonName(number, name)}}</span>
                        </td>
                    </table>
                </div>`,
    methods: {
        Stage: function(Experiment){
            window.location.href = '/stages/?Experiment=' + Experiment;
        },
        onDeleteButton: function(Experiment, index) {
            axios.post('delexperiments/?Experiment='+Experiment).then(res => {
                    console.log(res); // Результат ответа от сервера
                })
                .then(response => {})
            this.$emit('delete_experiment', index);
        },
        buttonName: function (number, name) {
            return '' + number + '. ' + name
        }
    }
})

Vue.component ('create_name', {
    props: ["visible", "names"],
    data: function() {
        return {
            name: '',
            vis: this.visible
        }
    },
    template:  `<div class="creating_experiment">
                    <input type="text" value="" ref="name" v-model="name" class="form-control"/>
                    <button v-on:click="addName" class="btn btn-info">Ок</button>
                    <button v-on:click="cancel" class="btn btn-danger">Отмена</button>
                </div>`,
    methods: {
        addName: async function(event) {
            var newName ={
                "Name":"1",
                "Number":"1",
                "id":"1",
            }
            newName.Name = this.name;
            newName.Number = this.names.length+1
            this.$emit(this.name);
            let newExperiment = await axios.post('experiments/', {Name: this.name})
            newName.id = newExperiment.data
            this.names.push(newName);
            console.log(this.names)
            this.$refs.name.value = "";
            this.name = "";

        },
        cancel: function(event) {
            this.$emit('hide');
            this.$refs.name.value = "";
            this.name = "";
        }
    }
})

new Vue ({
    el: '#experiments',
    data: {
        visible: false,
        names: null,
    },
    methods: {
        delete_experiment: function(index) {
            this.names.splice(index, 1);
        },

        hide: function() {
            this.visible = false;
        }
    },
    created:async function () {
        const vm = this;
        vm.names = await axios.get('/api/exp')
        vm.names = vm.names.data
        console.log(vm.names)
    }
})

