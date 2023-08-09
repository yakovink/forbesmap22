export default class State{
	constructor(name){
		this.name=name;
		this.cities=new Map();
		this.country="United States";
	}

	cityByName(name){
		for(var i of this.cities.values()){
			if(i.name==name){
				return i;
			}
		}
		return null;
	}

	getElement(elName){
		return this.cities.get(elName);
	}

	add(el){
		this.cities.set(el.name,el);
	}
	remove(elName){
		this.cities.delete(elName);
	}
}