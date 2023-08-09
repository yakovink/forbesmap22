import "../src/nouislider.min.js";


export default class Filter{
    constructor(world,map,vu){

        this.map=map;
        var f=this;

        

        var contIcons=["fa-solid fa-earth-america","fa-solid fa-earth-asia","fa-solid fa-earth-europe","fa-solid fa-earth-oceania","fa-solid fa-earth-africa"]


        var categories=["Automotive_#00E1BC", "Technology_#00E1BC"     , "Telecom_#00E1BC" 
                      , "Retail_#3B8FA7"        , "Finance_#3B8FA7"      ,"Investments_#3B8FA7",  "RealEstate_#3B8FA7"    
                        , "Media_#FA4ED3"        , "Entertainment_#FA4ED3" , "Fashion_#FA4ED3" , "Gambling_#FA4ED3"  , "Casinos_#FA4ED3"  , "Sports_#FA4ED3"  
                        ,"Food_#FF7C00", "Beverage_#FF7C00"        , "Logistics_#FF7C00"   , "Manufacturing_#FF7C00"   , "Healthcare_#FF7C00"  ,"Service_#FF7C00"               
                        ,"Mining_#2C9917"       , "Energy_#2C9917"             , "Metals_#2C9917"    , "Construction_#2C9917"       , "Engineering_#2C9917"
                         , "Diversified_#ADADAD"]


        this.corrent=[1,219,1,100,1,2666]

        this.vu=vu;

        

        


        this.originalWorld=world;
        this.filteredWorld={
            billioners: new Map(),
            cities: new Map(),
            countries: new Map(),

            splitGender: function(){
                var newData=new Map();
                newData.set("M",new Set());
                newData.set("F",new Set());
                newData.set("G",new Set());
                for(var i of this.countries.values()){
                    var map=i.splitGender();
                    newData.set("M",new Set([...newData.get("M"),...map.get("M")]));
                    newData.set("F",new Set([...newData.get("F"),...map.get("F")]));
                    newData.set("G",new Set([...newData.get("G"),...map.get("G")]));
                }
                return newData;
            },
            
            splitSelfMade: function(){
                var newData=new Map();
                newData.set(true,new Set());
                newData.set(false,new Set());
                for(var i of this.countries.values()){
                    var map=i.splitSelfMade();
                    newData.set(true,new Set([...newData.get(true),...map.get(true)]));
                    newData.set(false,new Set([...newData.get(false),...map.get(false)]));
                }
                return newData;
            },
        
            splitAge: function(){
                var data=Array(12).fill(new Set());
                for(var i of this.countries.values()){
                    var cdata=i.splitAge();
                    for(var j=0;j<data.length;j++){
                        data[j]=new Set([...data[j],...cdata[j]]);
                    }
                }
                return data;
            }
        };
  
        for(var i of this.originalWorld.billioners.keys()){
            this.filteredWorld.billioners.set(i,this.originalWorld.billioners.get(i));
        }
        for(var i of this.originalWorld.cities.keys()){
            this.filteredWorld.cities.set(i,this.originalWorld.cities.get(i));
            for(var j of this.originalWorld.cities.get(i).billioners.keys()){
                this.filteredWorld.cities.get(i).billioners.set(j,this.originalWorld.cities.get(i).billioners.get(j))
            }
        }
        for(var i of this.originalWorld.countries.keys()){
            this.filteredWorld.countries.set(i,this.originalWorld.countries.get(i));
            for(var j of this.originalWorld.countries.get(i).cities.keys()){
                this.filteredWorld.countries.get(i).cities.set(j,this.originalWorld.countries.get(i).cities.get(j))
            }
        }


        //personal filters
        this.finalWorthLimitTitle=document.createElement("p")
        this.finalWorthLimit=document.createElement("div");
        this.ageLimitTitle=document.createElement("p")
        this.ageLimit=document.createElement("div");
        this.rankLimitTitle=document.createElement("p")
        this.rankLimit=document.createElement("div");
        
        this.catgoriesFilterDiv=document.createElement("div")
        this.categorySelect=document.createElement("div")

        this.genderFilter=document.createElement("div");
        this.selfMadeFilter=document.createElement("div");
        this.continentFilter=document.createElement("div");;

        this.pane=document.getElementById("filterPane");
        this.pane.appendChild(this.finalWorthLimitTitle)
        this.pane.appendChild(this.finalWorthLimit)
        this.pane.appendChild(this.ageLimitTitle)
        this.pane.appendChild(this.ageLimit)
        this.pane.appendChild(this.rankLimitTitle)
        this.pane.appendChild(this.rankLimit)
        this.pane.appendChild(this.catgoriesFilterDiv)
        this.pane.appendChild(this.categorySelect)
        this.pane.appendChild(this.genderFilter)
        this.pane.appendChild(this.selfMadeFilter)
        this.pane.appendChild(this.continentFilter)



        this.finalWorthLimitTitle.innerHTML="<p id='finalWorthLimitTitle'><br>final worth:\xa0\xa0\xa01-219"
        this.finalWorthLimit.innerHTML='<div id="finalWorthLimit" style="margin-right: auto; margin-left: auto; width: 90%; margin-bottom: 10px; text-align: center;" ></div>'
        this.ageLimitTitle.innerHTML="<p id='ageLimitTitle'><br>age:\xa0\xa0\xa01-100"
        this.ageLimit.innerHTML='<div id="ageLimit" style="margin-right: auto; margin-left: auto; width: 90%; margin-bottom: 10px; text-align: center;" ></div>'
        this.rankLimitTitle.innerHTML="<p id='rankLimitTitle'><br>rank:\xa0\xa0\xa01-2666"
        this.rankLimit.innerHTML='<div id="rankLimit" style="margin-right: auto; margin-left: auto; width: 90%; margin-bottom: 10px; text-align: center;"></div>'
        
        this.catgoriesFilterDiv.innerHTML="<br>categories:<br><br><div class=grid-container style='display:grid;grid-template-columns: auto auto auto auto auto auto auto auto;' id='catgoriesFilterDiv'></div>"
        this.categorySelect.innerHTML="<input type='button' id='catSelect' value='Select All'/><input type='button' id='catDeselect' value='Clear All'/>"


        this.genderFilter.innerHTML="<br><p id='genderFilterTitle'>\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Male\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Female\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0Group<br>"+
            "<label class='switch'><input type='checkbox' class='genderFilterInput' checked><span class='MaleSlider slider round'></span></label><label class='switch'><input type='checkbox' class='genderFilterInput' checked><span class='FemaleSlider slider round'></span></label><label class='switch'><input type='checkbox' class='genderFilterInput' checked><span class='slider GroupSlider round'></span></label>"

        this.selfMadeFilter.innerHTML="<br><p id='genderFilterTitle'>\xa0\xa0\xa0\xa0SelfMade\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0inherited<br>"+
            "<label class='switch'><input type='checkbox' class='selfMadeFilterInput' checked><span class='RegSlider slider round'></span></label><label class='switch'><input type='checkbox' class='selfMadeFilterInput' checked><span class='RegSlider slider round'></span></label>"




        noUiSlider.create(this.finalWorthLimit,{
            connect: true,
            start: [ 1, 219 ],
            range: {
                min: 1,
                max: 219
            }});

        noUiSlider.create(this.ageLimit,{
            connect: true,
            start: [ 1, 100 ],
            range: {
                min: 1,
                max: 100
            }});

        noUiSlider.create(this.rankLimit,{
            connect: true,
            start: [ 1, 2666 ],
            range: {
                min: 1,
                max: 2666
            }});


        this.finalWorthLimit.noUiSlider.on('update', function( values, handle ) {
            document.getElementById("finalWorthLimitTitle").innerHTML="<p id='finalWorthLimitTitle'><br>final worth:\xa0\xa0\xa0"+parseInt(values[0])+"-"+parseInt(values[1]);
        })
        this.finalWorthLimit.noUiSlider.on('change', function( values, handle ) {
            f.corrent[0]=values[0]
            f.corrent[1]=values[1]
            f.filter();
            

        })

        this.ageLimit.noUiSlider.on('update', function( values, handle ) {
            document.getElementById("ageLimitTitle").innerHTML="<p id='ageLimitTitle'><br>age:\xa0\xa0\xa0"+parseInt(values[0])+"-"+parseInt(values[1]);
        })
        this.ageLimit.noUiSlider.on('change', function( values, handle ) {
            f.corrent[2]=values[0]
            f.corrent[3]=values[1]
            f.filter();

        })

        this.rankLimit.noUiSlider.on('update', function( values, handle ) {
            document.getElementById("rankLimitTitle").innerHTML="<p id='rankLimitTitle'><br>rank:\xa0\xa0\xa0"+parseInt(values[0])+"-"+parseInt(values[1]);
        })
        this.rankLimit.noUiSlider.on('change', function( values, handle ) {
            f.corrent[4]=values[0]
            f.corrent[5]=values[1]
            f.filter();
        })

        var catgoriesFilterDiv=document.getElementById('catgoriesFilterDiv');
        for(var i=0;i<25;i++){

                var cat=categories[i].split("_");
                var name=cat[0], col=cat[1]
                catgoriesFilterDiv.innerHTML+="<input class='CategoryCheckBox' type='checkbox' style='accent-color:"+col+";' name="+name+" id="+name+" value="+name+" checked><label for="+name+">"+name+"</label>";
        }

        for(var i=0;i<contIcons.length;i++){
            var cont=contIcons[i].split("-")[3]
            var cont=cont.charAt(0).toUpperCase()+cont.slice(1);
            this.continentFilter.innerHTML+="<button id='"+cont+"' class='continentFilterInput'>"+cont+" <br><i class='"+contIcons[i]+" fa-2x'></i> </button>\xa0\xa0"
        }


        var selec=document.getElementsByClassName('CategoryCheckBox');
                for(var i=0; i<selec.length; i++){
                    selec[i].addEventListener('change',function(e){
                        f.filter();
                    })
                }
        
        document.getElementById('catSelect').onclick=function(){
            var selec=document.getElementsByClassName('CategoryCheckBox');
                for(var i=0; i<selec.length; i++){
                    if(selec[i].type=='checkbox')
                        selec[i].checked=true;
                }
                f.filter();
        }
        document.getElementById('catDeselect').onclick=function(){
            var selec=document.getElementsByClassName('CategoryCheckBox');
                for(var i=0; i<selec.length; i++){
                    if(selec[i].type=='checkbox')
                        selec[i].checked=false;
                }
                f.filter();
        }

        var genderFilterInput= document.getElementsByClassName('genderFilterInput');
        for(var i=0;i<genderFilterInput.length;i++){
            genderFilterInput[i].addEventListener('change',function(e){
                f.filter();
            })
            
        }
        var selfMadeFilterInput= document.getElementsByClassName('selfMadeFilterInput');
        for(var i=0;i<selfMadeFilterInput.length;i++){
            selfMadeFilterInput[i].addEventListener('change',function(e){
                f.filter();
            })    
        }

        var contButtons=document.getElementsByClassName('continentFilterInput');
 
        for(var i=0;i<contButtons.length;i++){
  
            contButtons[i].onclick=function(e){
                var t=e.target;
                if(t.className!="continentFilterInput"){
                    t=t.parentNode;
                }
                var currectColor=getComputedStyle(t)['background-color'];
                if(currectColor=="rgb(30, 144, 255)"){
                    t.style.backgroundColor="#A0A0A0";
                    f.filter();
                }
                else{
                    t.style.backgroundColor="DodgerBlue";
                    f.filter();
                }
            };
        }


        

        
        


    }

    filter(){
        var newBillioners=new Map();
            var minWorth=this.corrent[0], maxWorth=this.corrent[1];
            var minAge=this.corrent[2], maxAge=this.corrent[3];
            var minRank=this.corrent[4], maxRank=this.corrent[5];
            var cats=document.getElementsByClassName('CategoryCheckBox')
            var activeCats=new Set();
            for(var i=0;i<cats.length;i++){
                if(cats[i].checked){
                    activeCats.add(cats[i].id)
                }
            }

            var gen=document.getElementsByClassName("genderFilterInput")
            var sm=document.getElementsByClassName('selfMadeFilterInput')

            var cont=document.getElementsByClassName('continentFilterInput')
            var activeCont=new Set();
            for(var i=0;i<cont.length;i++){
                if(getComputedStyle(cont[i])['background-color']=="rgb(30, 144, 255)"){
                    activeCont.add(cont[i].id)
                }
            }

            var allAge=(minAge==1&&maxAge==100)


            for(var billy of this.originalWorld.billioners.values()){

                var cat=false;
                var gen2=(gen[0].checked&&billy.gender=="M")||(gen[1].checked&&billy.gender=="F")||(gen[2].checked&&billy.gender=="G");
                var sm2=(sm[0].checked&&billy.selfMade)||(sm[1].checked&&(!billy.selfMade))
                var cont2=activeCont.has(billy.country.continent)

                for(var i=0;i<billy.category.length;i++){
                    
                    if(activeCats.has(billy.category[i])){
                        cat=true;
                        break;
                    }
                }

                if(minWorth<=billy.finalWorth&&billy.finalWorth<=maxWorth&&((minAge<=billy.age&&billy.age<=maxAge)||(allAge&&(typeof billy.age=="undefined"||isNaN(billy.age))))&&minRank<=billy.rank&&billy.rank<=maxRank&&cat&&gen2&&sm2&&cont2){
                    newBillioners.set(billy.name,billy);
  
                }
    
            }
            this.filteredWorld.billioners=newBillioners;
            this.organize();
    }







    filterByWorth(min,max,data){

        var billioners=new Map()
        for(var i of data.billioners.keys()){
            var f=data.get(i).finalWorth;
            if(f>min&&f<max){
                billioners.set(i,data.get(i));
            }
        }
        return billioners;
    }

    filterByAge(min,max,data){

        var billioners=new Map()
        for(var i of data.billioners.keys()){
            var f=data.get(i).age;
            if(f>min&&f<max){
                billioners.set(i,data.get(i));
            }
        }
        return billioners;
    }

    filterByRank(min,max,data){

        var billioners=new Map()
        for(var i of data.billioners.keys()){
            var f=data.get(i).rank;
            if(f>min&&f<max){
                billioners.set(i,data.get(i));
            }
        }
        return billioners;
    }

    markerType(city){
        var x=city.finalWorth;
        switch(true){
           case(x<1):
              return "0";
           case(x<=3):
              return "4";
           case(x<=10):
              return "3";
           case(x<=50):
              return "2";
           default:
              return "1";
        }  
     }

    


    organize(){

        for(var billy of this.originalWorld.billioners.keys()){
            var c=this.originalWorld.billioners.get(billy);
            var city=c.city
            

            if(city.billioners.has(billy)){
                city.billioners.delete(billy);
            }
            
        }

       for(var c of this.filteredWorld.billioners.keys()){
           var city=this.filteredWorld.billioners.get(c).city;
           if(!city.billioners.has(c)){
               city.billioners.set(c,this.filteredWorld.billioners.get(c));
           }
       }
       
        
    
        for(var cn of this.filteredWorld.countries.values()){
            cn.calcWorth();
        }
        

        for(var ct of this.filteredWorld.cities.values()){
            var micon=L.icon({iconUrl:"markers/"+this.markerType(ct)+".png",iconSize:[25,25]});
            ct.marker.setIcon(micon);

        if(ct.billioners.size!==0){
            
            var names='';
            if(ct.billioners.size<15){
               for(var j of ct.billioners.values()){
                  names+='<img src='+j.picture+' style="width:40px;height:40px;">'+j.rank+".  "+j.name+" "+j.finalWorth+"B,<br>";
               }
            }
            else if(ct.billioners.size<40){
               var tmp=Array.from(ct.billioners.values());
               for(var j=0;j<ct.billioners.size;j++){
                  var name=tmp[j].rank+". \xa0 \xa0"+tmp[j].name+" "+tmp[j].finalWorth;
                  names+="<div style='display:inline-block;width:350px;height:35px'><img src="+tmp[j].picture+' style="width:35px;height:35px;">'+name+"</div>";
                  names+=((j+1)%2==0)?"<BR>": "";
               }
            }
            else if(ct.billioners.size<100){
               var tmp=Array.from(ct.billioners.values());
               for(var j=0;j<ct.billioners.size;j++){
                  var name=tmp[j].rank+". \xa0 \xa0"+tmp[j].name+" "+tmp[j].finalWorth;
                  names+="<div style='display:inline-block;width:350px;height:30px'><img src="+tmp[j].picture+' style="width:30px;height:30px;">'+name+"</div>";
                  names+=((j+1)%3==0)?"<BR>": "";
               }
            }
            else{
               var tmp=Array.from(ct.billioners.values());
               for(var j=0;j<ct.billioners.size;j++){
                  var name=tmp[j].rank+". \xa0 \xa0"+tmp[j].name+" "+tmp[j].finalWorth;
                  names+="<div style='display:inline-block;width:350px;height:25px'><img src="+tmp[j].picture+' style="width:25px;height:25px;">'+name+"</div>";
                  names+=((j+1)%4==0)?"<BR>": "";
               }
            }

            ct.marker.bindTooltip(
                "<div style='background:#E5E4E2;font:georgia;brder-width:20px;border-color:#000'><h4>"+ct.name+""+((typeof ct.state==='undefined'||ct.state===null)?"":(", "+ct.state.name))+", "+ct.country.name+
                "<br>City billioners' SUM: "+ct.finalWorth.toFixed(1)+
                "B<br>Billioners amount: "+ct.billioners.size+
                "<br><br>"+names+"</h4>");

    
             L.tooltipLayout.getMarkers();
              L.tooltipLayout.getLine(ct.marker);
              L.tooltipLayout.initialize(this.map, this.onPolylineCreated);
        }
        else{
            
            var micon=L.icon({iconUrl:"markers/0.png",iconSize:[0,0]})
            ct.marker.setIcon(micon);
            ct.marker.unbindTooltip();
        }
    }

    document.getElementById("vizTitle").innerHTML="World Data";
    document.getElementById("listTitle").innerHTML="World Data";
    this.vu.update(this.filteredWorld);



        

    }

    onPolylineCreated(ply) {
        ply.setStyle({
          color: '#90A4AE'
        })
      }

      getCharacterLength (str) {
        return [...str].length;
      }




      

}