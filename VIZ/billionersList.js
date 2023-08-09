import "../src/Leaflet.Dialog.js"
import SpiderPig from "./spiderPig.js";

export default class BillionersList{
    constructor(map,dialog){
        this.pane=document.getElementById("myBillionersList");
        this.headline=document.createElement("h1");
        this.headline.setAttribute("id","listTitle");
        this.headline.innerHTML="World Data";
        this.add(this.headline);
        this.map=map;
        this.dialog=dialog;
        this.spiderpigs=new Map();

    }

    add(svgElement){
        this.pane.appendChild(svgElement);
    }

    create(billy){
        var dialog=this.dialog;
        var spiderpigs=this.spiderpigs;
        


        var infopop=function(billy){
            var arrpigs=Array.from(spiderpigs.values());
            
            var content="<div style='float:left;height:400;width:250px;'><h2>"+billy.name+
                "</h2><h3>\n("+billy.source+")</h3>"+
                "\n<img src="+billy.picture+" style='width:175px;height:200px;margin:10px'></img>"+
                "<p>\nBirth day: "+billy.birthday.getDate()+"/"+(billy.birthday.getMonth()+1)+"/"+billy.birthday.getFullYear()+
                "<p>\nRank: "+billy.rank+
                "<p>\nTotal Worth: "+billy.finalWorth+
                "\n<h4>About:</h4><p>"+billy.about+
                "\n<h4>Bio:</h4><p>\n"+billy.bio+
                "</div><svg height='400' width='350' style='float:left;' id='spiderPig'></svg>"+
                "<div id='compareList' style='width:150;height=300'></div>";

            var colors=["#EDC951;", "#CC333F;", "#00A0B0;","#FF94E0;","#FFFC40;"]


            dialog.setContent(content);
            dialog.open();
            var sp=new SpiderPig();
            sp.update(spiderpigs,billy);


            var listUpdate=function(){
                var list=document.getElementById("compareList");
                list.innerHTML="<button type='button' style='background-color:"+colors[0]+";width:150px;height:60px;font-size:24;' id='compareButton'>compare "+billy.name+"</button><br>";
                for(var i =0;i<arrpigs.length;i++){
                    list.innerHTML+="<button type='button' style='background-color:"+colors[i+1]+"width:150px;height:60px;font-size:24;' id='compare"+i+"'>"+((spiderpigs.size>0)?arrpigs[i].name:i+1)+"</button><br>"

                }
                if(arrpigs.length>0){
                    var but1=document.getElementById("compare0");
                    but1.onclick=function(e1){
                        var name1=e1.target.innerHTML;
                        spiderpigs.delete(name1);
                        arrpigs=Array.from(spiderpigs.values());
                        listUpdate();
                        sp.update(spiderpigs,billy);
                    }
                }
                if(arrpigs.length>1){
                    var but2=document.getElementById("compare1");
                    but2.onclick=function(e2){
                        var name2=e2.target.innerHTML;
                        spiderpigs.delete(name2);
                        arrpigs=Array.from(spiderpigs.values());
                        listUpdate();
                        sp.update(spiderpigs,billy);
                    }
                }
                if(arrpigs.length>2){
                    var but3=document.getElementById("compare2");
                    but3.onclick=function(e3){
                        var name3=e3.target.innerHTML;
                        spiderpigs.delete(name3);
                        arrpigs=Array.from(spiderpigs.values());
                        listUpdate();
                        sp.update(spiderpigs,billy);
                    }
                }


                var comp=document.getElementById("compareButton");
                comp.onclick=function(e){
                    if(spiderpigs.size<3){
                    spiderpigs.set(billy.name,billy);
                    arrpigs=Array.from(spiderpigs.values());
                    listUpdate();
                    sp.update(spiderpigs,billy);
                }
                }
            }
            listUpdate();
   
        }

        var element =document.createElement("p");
        element.style.display="flex;";
        element.style.alignItems="center;"
        element.style.justifyContent="center";
        element.style.width="400";
        element.style.height="100";
        element.style.backgroundColor="#C6DEDF";
        element.className="billionerCard";
        element.innerHTML+=
            '<img src='+billy.picture+" style='width:60px;height:80px;float:left;margin:10px'></img>"+
            "<p>Name: "+billy.name+", Age: "+billy.age+
            "<br>Living at "+billy.city.tostring()+
            "<br>Final worth: "+billy.finalWorth+"B, rank: "+billy.rank+
            "<br>Market: "+billy.category.join(", ")+
            "<br>(For more information, click here)"+
            "</p>"
        element.addEventListener("mouseover",function(){
            element.style.backgroundColor="gray";
        })
        element.addEventListener("mouseout",function(){
            element.style.backgroundColor="#C6DEDF";
        })
        element.addEventListener("click",function(){
            infopop(billy)
        })
        return element;

        
    }


    update(data){
        var old=document.getElementsByClassName("billionerCard");
        for(var i of old){
            i.innerHTML="";
        }
        for(var i of data){
            this.add(this.create(i))
        }
    }


}