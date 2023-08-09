   
         import LoadCSS from './tools/loadCss.js';
         import "./src/leaflet.js";
         import "./src/leaflet.legend.js";
         import "./src/Leaflet.AnimatedSearchBox.js"
         import { World } from './classes/world.js';
         import "./src/leaflet.sidebar.js";
         import "./VIZ/genderChart.js";
         import "./src/leaflet.tooltip.js";
         import CityMarker from './markers/cityMarker.js';
         import Filter from './VIZ/filters.js';
         import VizUpdater from './VIZ/vizUpdate.js';
         import "./src/Leaflet.Dialog.js"

         function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }

          function markerType(city){
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

         function removeMarker(country,city){
            map.removeLayer(data.countries.get(country).cityByName(city).marker)
         }

         function onPolylineCreated(ply) {
            ply.setStyle({
              color: '#90A4AE'
            })
          }

          function getCharacterLength (str) {
            return [...str].length;
          }
      
         var cssLoader=new LoadCSS();
         var data=new World();

        
         
   

         
         
         cssLoader.load("./src/leaflet.css");
         cssLoader.load("./src/leaflet.legend.css");
         cssLoader.load("./src/Leaflet.AnimatedSearchBox.css");
         cssLoader.load("./src/leaflet.sidebar.css");
         cssLoader.load("./src/nouislider.min.css");
         cssLoader.load("./src/toogle-radios.css");
         cssLoader.load("./src/iphoneToggle.css");
         cssLoader.load("./src/Leaflet.Dialog.css");
         //create the map

         var mapOptions = {
            center: [0, 0],
            zoom:3,
            minZoom:3
         }
         var map = new L.map('map', mapOptions);        
         var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
         map.addLayer(layer);
         var opt={
            size:[800,500],
            anchor:[250,250],
            position: "topleft"
        }
        
        var dialog=L.control.dialog(opt).setContent("<p>Hello! Welcome to your nice new dialog box!</p>").addTo(map);
        dialog.close();
         var vu=new VizUpdater(map,dialog);
         var filters=new Filter(data,map,vu);
         
         

         //add searchbox
        var searchBox = L.control.searchbox({
         position: 'topleft',
         expand: 'right',
         autocompleteFeatures:'setValueOnClick',
         closeButton: true
     }).addTo(map);
         var searchBoxList=new Set();
         for(var billy of data.billioners){
            searchBoxList.add("("+billy[1].source+") "+billy[1].name);
         }

         for(var city of data.cities){
            var s=city[1].country.name+", "+city[1].name;
            if(city[1].country.name=='United States'){
               s+=", "+city[1].state.name;
            }
            searchBoxList.add(s);
         }
         searchBox.onInput("keyup",function(str){
            searchBox.clearItems();
            if(searchBox.getValue().length>=3){
               for(var s of searchBoxList){
                  if(s.toLowerCase().includes(searchBox.getValue().toLowerCase())&&searchBox.getItems().length<=5){
                     searchBox.addItem(s);
                  }
               }
            }
         });
         var search=function(){
            var toFind=searchBox.getValue().split(", ");
            if (toFind[0]==''){
               searchBox.toggle();
               return;
            }
            var city;
            if(toFind.length===1){
               toFind[0]=toFind[0].split(") ")[1]
               var billy=data.billioners.get(toFind[0]);
               if(typeof billy=='undefined'){
                  searchBox.clear();
                  return;
               }
               city=billy.city;
            }
            if(toFind.length ===2||toFind.length===3){
            var country=data.countries.get(toFind[0]);
            if(typeof country=='undefined'){
               searchBox.clear();
               return;
            }
            if(toFind.length===3){
               country=country.states.get(toFind[2]);
            }
            city=country.cityByName(toFind[1]);
         }
            map.flyTo([city.lon,city.lat],11);
         }

         searchBox.onButton('click',search());
         map.on('keypress',function(e){
            var key=e.originalEvent.code;
            if(key=='Enter'){
               search();
            }
         })


         //add legend
         var legend = L.control.Legend({
            position: "bottomleft",
            collapsed: false,
            symbolWidth: 40,
            opacity: 1,
            column: 1,
            legends: [{
                label: "1-3B",
                type: "image",
                url: "markers/4.png",
            }, {
                label: "3-10B",
                type: "image",
                url: "markers/3.png"
            }, {
                label: "10-50B",
                type: "image",
                url: "markers/2.png"
            }, {
                label: "More than 50B",
                type: "image",
                url: "markers/1.png"
            }]
        });
        legend.addTo(map);

        //add distance scale
        var scale=L.control.scale({position:"bottomleft"});
        scale.addTo(map);


        var sidebar = L.control.sidebar({ 
           container: 'sidebar',
           position: 'right'
         }).addTo(map);

         
      sidebar.addPanel({
         id:   'dataViz',
         tab:  '<i class="fa-solid fa-chart-column"></i>',
         title: 'Vizualization',
         pane: document.getElementById('myDataViz')
         
         
     })
      .addPanel({
            id:   'forbesList',
            tab:  '<i class="fas fa-user-friends"></i>',
            title: 'Billioners list',
            pane: document.getElementById("myBillionersList"),
         })
      .addPanel({
            id:   'filter',
            tab:  '<i class="fa-solid fa-filter-circle-dollar"></i>',
            title: 'Filters',
            pane: document.getElementById("filterPane"),
         })


        // be notified when a panel is opened
        sidebar.on('content', function (ev) {
            switch (ev.id) {
                case 'moreInfo':
                sidebar.options.autopan = true;
                break;
                default:
                sidebar.options.autopan = false;
            }
        });

        document.getElementById("vizTitle").innerHTML="World Data";
        vu.update(data);

        map.on('click',function(e){
         filters.filter();
        })
        



         // setting marks on the map
         
         for(var i of data.cities.values()){
            var markerIcon=L.icon({iconUrl:"markers/"+markerType(i)+".png",iconSize:[25,25]});
            var mOption={
               icon: markerIcon
            }
        
         var m=new CityMarker([i.lon,i.lat],mOption,i);
        
         m.on('click',function(c){  
            var city=c.sourceTarget.city;
            document.getElementById("vizTitle").innerHTML=city.tostring()+" Data";
            document.getElementById("listTitle").innerHTML=city.tostring()+" Data";
            vu.update(c.sourceTarget.city);

         });
         i.marker=m;
         m.addTo(map);
         var names='';
         if(i.billioners.size<15){
            for(var j of i.billioners.values()){
               names+='<img src='+j.picture+' style="width:40px;height:40px;">'+j.rank+".  "+j.name+" "+j.finalWorth+"B,<br>";
            }
         }
         else if(i.billioners.size<40){
            var tmp=Array.from(i.billioners.values());
            for(var j=0;j<i.billioners.size;j++){
               var name=tmp[j].rank+". \xa0 \xa0"+tmp[j].name+" "+tmp[j].finalWorth;
               names+="<div style='display:inline-block;width:350px;height:35px'><img src="+tmp[j].picture+' style="width:35px;height:35px;">'+name+"</div>";
               var l=getCharacterLength(name);
               names+=((j+1)%2==0)?"<BR>": "";
            }
         }
         else if(i.billioners.size<100){
            var tmp=Array.from(i.billioners.values());
            for(var j=0;j<i.billioners.size;j++){
               var name=tmp[j].rank+". \xa0 \xa0"+tmp[j].name+" "+tmp[j].finalWorth;
               names+="<div style='display:inline-block;width:350px;height:30px'><img src="+tmp[j].picture+' style="width:30px;height:30px;">'+name+"</div>";
               var l=getCharacterLength(name);
               names+=((j+1)%3==0)?"<BR>": "";
            }
         }
         else{
            var tmp=Array.from(i.billioners.values());
            for(var j=0;j<i.billioners.size;j++){
               var name=tmp[j].rank+". \xa0 \xa0"+tmp[j].name+" "+tmp[j].finalWorth;
               names+="<div style='display:inline-block;width:350px;height:25px'><img src="+tmp[j].picture+' style="width:25px;height:25px;">'+name+"</div>";
               var l=getCharacterLength(name);
               names+=((j+1)%4==0)?"<BR>": "";
            }
         }
         
         m.bindTooltip(
            "<div style='background:#E5E4E2;font:georgia;brder-width:20px;border-color:#000'><h4>"+i.name+""+((typeof i.state==='undefined'||i.state===null)?"":(", "+i.state.name))+", "+i.country.name+
            "<br>City billioners' SUM: "+i.finalWorth.toFixed(1)+
            "B<br>Billioners amount: "+i.billioners.size+
            "<br><br>"+names+"</h4>");

         L.tooltipLayout.getMarkers();
          L.tooltipLayout.getLine(m);
          L.tooltipLayout.initialize(map, onPolylineCreated);

          

      
      
 
      }



