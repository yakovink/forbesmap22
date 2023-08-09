export default class AgeChart{


    constructor(){
       
        this.margin = {top: 20, right: 20, bottom: 40, left: 40},
        this.width = 370 - this.margin.left - this.margin.right,
        this.height = 320 - this.margin.top - this.margin.bottom;

        
        this.chart = d3.select("#ageChart")
            .append("svg")
            .attr("height",this.height+55)
            .attr("width",this.width+50)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


            var oldAxis=document.getElementsByClassName("axis");
            for(var i of oldAxis){
                i.innerHTML="";
                if(i.innerHTML==""){
                    i.remove();
                }
            }
    }


    update(data){

        var oldAxis=document.getElementsByClassName("axis-y");
        for(var i of oldAxis){
            i.innerHTML="";
            if(i.innerHTML==""){
                i.remove();
            }
        }
        var oldAxis=document.getElementsByClassName("axis-x");
        for(var i of oldAxis){
            i.innerHTML="";
            if(i.innerHTML==""){
                i.remove();
            }
        }
        var oldAxis=document.getElementsByClassName("axis");
        for(var i of oldAxis){
            i.innerHTML="";
            if(i.innerHTML==""){
                i.remove();
            }
        }


        var tooltip = d3
            .select('#ageChart')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('z-index', '10')
            .style('visibility', 'hidden')
            .style('padding', '10px')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .text('a simple tooltip');

        var ready_data=[
            {age:"0",value: data[0].size},
            {age:"10",value: data[1].size},
            {age:"20",value: data[2].size},
            {age:"30",value: data[3].size},
            {age:"40",value: data[4].size},
            {age:"50",value: data[5].size},
            {age:"60",value: data[6].size},
            {age:"70",value: data[7].size},
            {age:"80",value: data[8].size},
            {age:"90",value: data[9].size},
            {age:"100",value: data[10].size},
            {age:"?",value: data[11].size},
        ]

        var sum=0;
        for(var i=0;i<ready_data.length;i++){
            sum+=ready_data[i].value;
        }

        

        // Add scales
        var xScale = d3.scaleBand()
            .domain(d3.map(ready_data,function(d) {return d.age; }).keys())
            .rangeRound([0,this.width])
            .padding(0.03);

        var yScale = d3.scaleLinear()
            .domain([0, this.maxValue(ready_data)])
            .rangeRound([this.height, 0]);
        
        // Add x-axis
        this.chart.append("g")
            .style("font-size","10px")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(xScale).tickSize(10));
        // Add y-axis
        this.chart.append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(yScale).ticks(5));
        
        // Append rectangles
        var rect=this.chart.selectAll("rect")
            .data(ready_data);

        rect
        .enter()
            .append("rect")
            .merge(rect)
            .attr("x", function(d) {
                return xScale(d.age);})
            .attr("width", function() {return xScale.bandwidth(); })
            .on('mouseover', function (d) {
                tooltip.html(
                    `<div>${((d.age=="?")?"Unknown age: ":("age:"+d.age+"-"+(parseInt(d.age)+9)))}</div><div> ${d.value+" billioners ("+Number(d.value*100/sum).toFixed(1)+"%)"}</div>`
                )
                .style('visibility', 'visible');
                d3.select(this).transition().attr('fill', "#94DF69");
            })
            .on('mousemove', function () {
                tooltip
                .style('top', d3.event.pageY - 100 + 'px')
                .style('left', d3.event.pageX - 1440 + 'px');
            })
            .on('mouseout', function () {
                tooltip.html(``).style('visibility', 'hidden');
                d3.select(this).transition().attr('fill', "#FD0054");
            })
            .transition()
            .duration(1000)
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) {return 260 - yScale(d.value);})
            .attr("fill","#FD0054")


            this.chart.append("text")
            .attr("class","axis axis-x")
            .attr("text-anchor", "end")
            .attr("x", this.width-10)
            .attr("y", this.height + this.margin.top+10 )
            .text("age");

            this.chart.append("text")
                .attr("class","axis axis-y")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -this.margin.left+10)
                .attr("x", -this.margin.top-10)
                .text("billioners")


        rect
            .exit()
            .remove()
    }



    maxValue(data){
        var m=0;
        for(var i of data){
            if(i.value>m){
                m=i.value;
            }
        }
        return m;
    }
}


