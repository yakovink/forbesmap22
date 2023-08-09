

import {Country,US} from "./country.js";
import State from "./state.js";
import Billioner from "./billioner.js";
import Reader from "../tools/reader.js";
import City from "./city.js";
import Sorter from "../tools/sorter.js";


export class World{
	constructor(){

		var continenets=[
			{key:"America",value: ["United States","Canada","Mexico","Bahamas","Cayman Islands","British Virgin Islands","Bermuda","Brazil","Chile","Argentina","Colombia","Peru","Uruguay","Turks and Caicos Islands"]},
			{key:"Asia",value:["China","India","Hong Kong","Japan","Taiwan","South Korea","Thailand","Israel","United Arab Emirates","Kazakhstan",
			"Vietnam","Lebanon","Georgia","Qatar","Cambodia","Oman","Bahrain","Nepal"]},
			{key:"Europe",value:["Germany","France","United Kingdom","Switzerland","Russia","Italy","Spain","Sweden","Austria","Denmark","Monaco","Belgium","Czechia","Turkey",
			"Norway","Netherlands","Poland","Finland","Ireland","Ukraine","Portugal","Romania","Slovakia","Hungary","Liechtenstein","Greece"]},
			{key:"Oceania",value:["Australia","Indonesia","Philippines","New Zealand","Malaysia","Singapore"]},
			{key:"Africa",value:["Nigeria","South Africa","Egypt","Eswatini","Algeria","Morocco","Tanzania","Eswatini"]}]


		this.countries=new Map();
		this.cities=new Map();
		this.billioners=new Map();



		var input=new Reader();
		var sorty=new Sorter();
		var billionersData=input.readTextFile("./database/forbes22.csv");
		var citiesData=input.readTextFile("./database/cities.csv");
		var countriesData=input.readTextFile("./database/countries.csv");
		var pictures=input.readTextFile("./database/pics.log")
		var categories=new Set();


		this.pictures=pictures.split("\n");


		countriesData=countriesData.split("\n");
		countriesData.pop();
		countriesData.shift();
		for(var i = 0;i<247;i++){
			countriesData[i]=countriesData[i].slice(0,-1);
			if(countriesData[i]=='United States'){
				this.countries.set(countriesData[i],new US());
			}
			else{
			var cont="1";
			for(var j=0; j<continenets.length;j++){
				if(continenets[j].value.includes(countriesData[i])){
					cont=continenets[j].key;
				}
			}
			this.countries.set(countriesData[i],new Country(countriesData[i],cont));
			
			}
		}
		
		
		
		for(var i=245;i<countriesData.length;i++){
			countriesData[i]=countriesData[i].slice(0,-1);
			this.countries.get('United States').add(new State(countriesData[i]));
		}
		citiesData=citiesData.split("\n");
		citiesData.pop();
		citiesData.shift();
		for(var i=0; i<citiesData.length;i++){
			citiesData[i]=citiesData[i].split(",");
			citiesData[i][5]=citiesData[i][5].slice(0,-1);
			if(!this.countries.has(citiesData[i][3])){
				this.countries.set(citiesData[i][3],new Country(citiesData[i][3]))
			}
			var c=new City(
				citiesData[i][0],//name
				parseFloat(citiesData[i][2]),//lat
				parseFloat(citiesData[i][1]),//lon
				this.countries.get(citiesData[i][3]),//country
				(citiesData[i][4]===null||citiesData[i][4]=="")?"none":citiesData[i][4],//capital
				parseInt(citiesData[i][5]));//populution
			
			this.countries.get(citiesData[i][3]).addCity(c);
			this.cities.set(c.hash(),c);
		}



		billionersData=billionersData.split("\n"); 
		billionersData.pop();
		billionersData.shift();
		for(var i=0;i<billionersData.length;i++){
			billionersData[i]=billionersData[i].slice(0,-1).split(",");
			var birth=billionersData[i][15].split("/");
			var billy=new Billioner(
				parseInt(billionersData[i][0]),//rank
				billionersData[i][1],//name
				parseInt(billionersData[i][2]),//age
				parseFloat(billionersData[i][3])/1000,//finalWorth
				parseInt(billionersData[i][4]),//year
				billionersData[i][6].split(" and "),//category
				billionersData[i][7],//source
				this.countries.get(billionersData[i][8]),//country
				this.countries.get(billionersData[i][8]).cityByName(billionersData[i][10]),//city
				(billionersData[i][13]==='TRUE'),//selfMade
				billionersData[i][14],//gender
				new Date(birth[2],birth[1],birth[0]),//birthday
				billionersData[i][20],//bio
				billionersData[i][21],//about
				this.pictureExist(billionersData[i][1]));//has picture
								
		    this.billioners.set(billy.name,billy);
			if(typeof billy.country=="undefined"||billy.country===null){
				billy.country=billy.city.country;
			}
			
			if(billy.country.name=='United States'){
				billy.state=this.countries.get('United States').states.get(billionersData[i][9]);
				//console.log(billionersData[i][22]+" "+billionersData[i][23]+" "+billy.name)
				billy.state.add(this.cities.get(billionersData[i][22]*billionersData[i][23]));
				billy.city=this.countries.get('United States').cityByStateAndName(billy.state.name,billionersData[i][10]);
				
				if(typeof billy.city=='undefined'||billy.city===null){
					billy.city=this.cities.get(billionersData[i][22]*billionersData[i][23]);
				}
				billy.city.state=billy.state;
			}
			else if(typeof billy.city=='undefined'||billy.city===null){
				
				billy.city=this.cities.get(billionersData[i][22]*billionersData[i][23]);
				
			}
			billy.city.add(billy);
		}

		

		for(var i of this.billioners.values()){
			for(var j=0;j<i.category.length;j++){
					if(!categories.has(i.category[j])){
						categories.add(i.category[j])
				}
			}
		}


		for(var i of this.cities.keys()){
            if(this.cities.get(i).billioners.size==0||this.cities.get(i).billioners===null){
			   this.cities.get(i).country.remove(this.cities.get(i));
               this.cities.delete(i);
            }
         }
		 for(var i of this.countries.keys()){
			 if(this.countries.get(i).cities.size==0||this.countries.get(i).cities===null){
				 this.countries.delete(i);
			 }
		 }


		for(var cn of this.countries.values()){
			cn.calcWorth()
		}

		this.cities=sorty.backsort(this.cities);
		this.countries=sorty.backsort(this.countries);


	}



	splitGender(){
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
	}
	
	splitSelfMade(){
		var newData=new Map();
		newData.set(true,new Set());
		newData.set(false,new Set());
		for(var i of this.countries.values()){
			var map=i.splitSelfMade();
			newData.set(true,new Set([...newData.get(true),...map.get(true)]));
			newData.set(false,new Set([...newData.get(false),...map.get(false)]));
		}
		return newData;
	}

	splitAge(){
		var data=Array(12).fill(new Set());
		for(var i of this.countries.values()){
			var cdata=i.splitAge();
			for(var j=0;j<data.length;j++){
				data[j]=new Set([...data[j],...cdata[j]]);
			}
		}
		return data;
	}


	pictureExist(name){
		var pic=(name.split(" ")).join("")+".jpg";
		return this.pictures.includes(pic)?pic:"undefined"
	}

	
}
