document.addEventListener("DOMContentLoaded", function(){
        console.log( JSON.parse(document.getElementById('SampleName').textContent))
        if (JSON.parse(document.getElementById('SampleName')).textContent != null) {
                document.title = JSON.parse(document.getElementById('SampleName').textContent)
        }
})
