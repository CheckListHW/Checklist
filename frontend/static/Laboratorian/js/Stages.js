new Vue ({
    el: '#etaps',
    data: {
        ExeExperiment: JSON.parse(document.getElementById('ExeExperiment').textContent),
        etaps: [], //Взято с БД
        Stages: [], //Взято с БД
        Stage: null, //Взято с БД
        disabled: [], //Изначально количество true равно количеству элемнтов в etaps, первый элемент всегда false
        button_visible: false,
        etap: "",
        number:"",
    },
    methods: {
        choose_etap: function(index) {
            this.etap = this.etaps[index];
            this.Stage = this.Stages[index];
            this.number = index+1;
            this.button_visible = !this.button_visible;
        },
        Stuffs: function(index) {
            window.location.href = '/lab/stuffs/?ExeStage=' + this.Stage.id
        },
    },
    created: async function() {
        const vm = this
        let exestage = await axios.get(`/api/exestage/?ExeExperiment=${vm.ExeExperiment}`)
        x = exestage.data;
        y = [];
        yy = [];
        yy.push(false)
        x.forEach(function (item) {
            if (item.PreparatoryStage != 1 & item.Number > 0)
            {
               y.push(item.Name);
               vm.Stages.push(item);
               yy.push(item.Check);
            }
        })
        this.etaps = y;
        this.disabled = yy;
    }
})