export default class genderChart{

    constructor(){
        // set the dimensions and margins of the graph
        var width = 400
        var height = 340
        var margin = 80

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        this.radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        this.svg = d3.select("#genderChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        


        this.svg.append("circle").attr("cx",190).attr("cy",100).attr("r", 10).style("fill", "#6ECBF9")
        this.svg.append("circle").attr("cx",190).attr("cy",120).attr("r", 10).style("fill", "#FF53B3")
        this.svg.append("circle").attr("cx",190).attr("cy",140).attr("r", 10).style("fill", "#94DF69")
        this.svg.append("text").attr("x", 100).attr("y", 100).text("Male").style("font-size", "20px").attr("alignment-baseline","middle")
        this.svg.append("text").attr("x", 100).attr("y", 120).text("Female").style("font-size", "20px").attr("alignment-baseline","middle")
        this.svg.append("text").attr("x", 100).attr("y", 140).text("Groups").style("font-size", "20px").attr("alignment-baseline","middle")

        
    }
    
    update(data) {

        var exsistLabels=document.getElementsByClassName('chartLabel')
        for(var el of exsistLabels){
          el.innerHTML="";
          if(el==""){
            el.remove();
          }
        }

        
        // Compute the position of each group on the pie:
        var pie = d3.pie()
          .value(function(d) {return d.value; })
          .sort(function(a, b) {
              return d3.ascending(a.key, b.key);
            } ) // This make sure that group order remains the same in the pie chart 

          

          var data_ready={'Male':data.get('M').size,'Female':data.get('F').size,'Group':data.get('G').size};
          var data_ready = pie(d3.entries(data_ready))
          var sum=data.get('M').size+data.get('F').size+data.get('G').size;
          
          var palet=new Map();
          palet.set("Male","#6ECBF9");
          palet.set("Female","#FF53B3");
          palet.set("Group","#94DF69");
            
          var arcGenerator = d3.arc()
          .innerRadius(100)
           .outerRadius(this.radius+110)
      

        // map to data
        var u = this.svg.selectAll("path")
          .data(data_ready)
          
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        try{
        u
          .enter()
          .append('path')
          .merge(u)
          .transition()
          .duration(1000)
          .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius)
          )
          .attr('fill', function(d){
             return(palet.get(d.data.key))
            })
          .attr("stroke", "white")
          .style("stroke-width", "2px")
          .style("opacity", 1)
        }
        catch (e){}
        // remove the group that is not present anymore
        
        this.svg
          .selectAll('mySlices')
          .data(data_ready)
          .enter()
          .append('text')
          .text(function(d){
            if(d.value==0){
              return "";
            }
            return d.data.key+":\xa0\xa0"+d.data.value+"\n("+Number(d.data.value*100/sum).toFixed(1)+"%)" 
          })
          .attr("transform", function(d) {return "translate(" + arcGenerator.centroid(d) + ")";})
          .style("text-anchor", "middle")
          .style("font-size", 14)
          .attr('class','chartLabel')



          u
          .exit()
          .remove()

      
        
          }
    }
