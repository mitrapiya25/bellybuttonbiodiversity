var dropdown = document.querySelector("#selDataset")

function renderdropdown(){
    Plotly.d3.json('/names', function(error, data){
        if (error) return console.warn(error);

        for(var i =0;i<data.length;i++){
            var opt = document.createElement("option")
            opt.setAttribute("value", data[i])
            opt.innerHTML = data[i]
            dropdown.appendChild(opt)
                               
        } 
    })
}
function optionChanged(sample){
    
    Plotly.d3.json(`/samples/${sample}`, function(error, data){
        if (error) return console.warn(error);

        populate_metadata(sample)
            var samples = data[0]["sample_values"]
            var out = data[0]["out_id"]
            var labels = []
            Plotly.d3.json('/otu',function(error, data){
                if (error) return console.warn(error);

                labels= data
                var ylabel = []
                for(var i =0;i<10;i++){
                     ylabel.push(labels[out[i]-1]) }    
                Plotly.restyle('pie', 'values', [samples]);
                Plotly.restyle('pie', 'labels', [out]);
                Plotly.restyle('scatter', 'y', [samples]);
                Plotly.restyle('scatter', 'x', [out]);
                Plotly.restyle('scatter', 'hoverinfo', [labels]);
                Plotly.restyle('scatter', 'text', [ylabel]);
                var mark = {size: samples,
                    color : out}
                Plotly.restyle('scatter',"marker",[mark])    
            })
                              
    })
}

function populate_metadata(sample){
    var metadata = document.querySelector("#metadata")
    var parent = document.getElementById("metadat_placeholder")
    metadata.innerHTML =" "
    Plotly.d3.json(`/metadata/${sample}`, function(error, data){
        if (error) return console.warn(error);

        
        for(var key in data[0]){
            var para = document.createElement("p")
            para.setAttribute("id","metadat_placeholder")
            para.innerHTML = key + " : " + data[0][key]
            metadata.appendChild(para)
        }
        
                         
    })
}

function init(){
    sample ='BB_940'
    Plotly.d3.json(`/samples/${sample}`, function(error, data){
        if (error) return console.warn(error);

        populate_metadata(sample)
        var samples = data[0]["sample_values"]
        var out = data[0]["out_id"]
        var labels = []
        Plotly.d3.json('/otu',function(error, data){
            if (error) return console.warn(error);

            labels= data
            var ylabel = []
            for(var i =0;i<10;i++){
                 ylabel.push(labels[out[i]-1]) }
        
        
             var tracepie = [{
            values: samples,
            labels: out,
            type: 'pie',
            hoverinfo:labels
          }];
          var layoutpie = {
            height: 400,
            width: 500
          };
            Plotly.newPlot("pie",tracepie,layoutpie)
            var tracescatter = [{
                x: out,
                labels: samples,
                type: 'scatter',
                mode: 'markers',
                hoverinfo:labels,
                text: ylabel,
                marker: { size: samples,
                          color : out }
              }];
              var layoutscatter = {
                height: 400,
                width: 700
              }; 
            Plotly.newPlot("scatter",tracescatter,layoutscatter)
         })
                    
    })      
}



init()
renderdropdown()
