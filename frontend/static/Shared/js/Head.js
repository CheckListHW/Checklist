document.addEventListener("DOMContentLoaded", function(){
        let sampleName = JSON.parse(document.getElementById('SampleName').textContent)
        if (sampleName != null & sampleName != '') {
                document.title = sampleName
        }
        else{
                document.title ='Номер пробы: ' + JSON.parse(document.getElementById('Sample').textContent)
        }
})
