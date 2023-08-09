export default class City{
	constructor(name,lat,lon,country,capital,population){
		this.population=population;
		this.capital=capital;
		this.name = name;
		this.lat = lat;
		this.lon = lon;
		this.billioners = new Map();
		this.country = country;
		this.finalWorth=0;
		this.state=null;
		this.marker=null;

	}

	hash(){
		return this.lat*this.lon;
	}

	add(bill){
		if(bill==null||this.billioners.has(bill.getName)){
			return false;
		}
		this.billioners.set(bill.name,bill);
		return true;
	}
	remove(bill){
		return (this.billioners.has(bill.name))&&this.billioners.remove(bill.name);
	}

	coorditates(){
		return [this.lat,this.lon];
	}

	getBillioner(bill){
		return this.billioners.get(bill);
	}

	equals(other){
		return(other instanceof City&&other.hash()==this.hash());
	}
	compare(other){
		if(other instanceof City){
			return (this.finalWorth>other.finalWorth)?1:-1;
		}
		return null;
	}
	getAmount(){
		return this.billioners.size;
	}
	splitGender(){
		var newData=new Map();
		newData.set("M",new Set());
		newData.set("F",new Set());
		newData.set("G",new Set());
		for(var i of this.billioners.values()){
			newData.get(i.gender).add(i);
		}
		return newData;
	}
	splitSelfMade(){
		var newData=new Map();
		newData.set(true,new Set());
		newData.set(false,new Set());
		for(var i of this.billioners.values()){
			newData.get(i.selfMade).add(i);
		}
		return newData;
	}

	splitAge(){
		var data=Array(12);
		for(var i=0;i<data.length;i++){
			data[i]=new Set();
		}
		for(var i of this.billioners.values()){
			if(typeof i.age=='undefined'||isNaN(i.age)){
				data[11].add(i);
			}
			else{
				data[parseInt(i.age/10)].add(i);
			}
		}
		return data;
	}



	calcWorth(){
		var sum=0;
		for(var i of this.billioners.values()){
			sum+=i.finalWorth;
		}
		this.finalWorth=sum;
		return sum;
	}

	tostring(){
		return this.name+", "+((this.country.name=="United States")?this.state.name+", ":"")+this.country.name;
	}
	

}