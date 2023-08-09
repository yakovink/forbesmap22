
export class Country{
	constructor(name,continent){
		this.name=name;
		this.cities=new Map();
		this.finalWorth=0;
		this.continent=continent;
	}




	addCity(el){
		if(el===null||this.cities.has(el.hash())){
			return false;
		}
		this.cities.set(el.hash(),el);
		return true;
	}

	cityByName(name){
		for(var i of this.cities.values()){
			if(i.name==name){
				return i;
			}
		}
		return null;
	}

	remove(el){
		return this.cities.has(el.hash())&&this.cities.delete(el.hash());
	}

	equals(other){
		return other instanceof Country&&other.name==this.name;
	}
	compare(other){
		if(other instanceof Country){
			return (this.finalWorth>other.finalWorth)?1:-1;
		}
		return null;
	}


	splitGender(){
		var newData=new Map();
		newData.set("M",new Set());
		newData.set("F",new Set());
		newData.set("G",new Set());
		for(var i of this.cities.values()){
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
		for(var i of this.cities.values()){
			var map=i.splitSelfMade();
			newData.set(true,new Set([...newData.get(true),...map.get(true)]));
			newData.set(false,new Set([...newData.get(false),...map.get(false)]));
		}
		return newData;
	}

	splitAge(){
		var data=Array(12).fill(new Set());
		for(var i of this.cities.values()){
			var cdata=i.splitAge();
			for(var j=0;j<data.length;j++){
				data[j]=new Set([...data[j],...cdata[j]]);
			}
		}
		return data;
	}

	calcWorth(){
		var sum=0;
		for(var i of this.cities.values()){
			sum+=i.calcWorth();
		}
		this.finalWorth=sum;
		return sum;
	}

}

export class US extends Country{
	constructor(){
		super('United States','America');
		this.states=new Map();
	}

	getState(name){
		return this.states.get(name);
	}
	add(st){
		if(st==null){
			return false;
		}
		this.states.set(st.name,st);
		return true;
	}
	addCity(ct){
		if(ct==null){
			return false;
		}
		this.cities.set(ct.hash(),ct);
		return true;
	}
	removeState(name){
		return this.states.has(name)&&this.states.delete(name);
	}

	cityByStateAndName(state,city){
		return this.states.get(state).cityByName(city);
	}
	

}