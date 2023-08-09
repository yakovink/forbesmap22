


export default class Billioner{
	constructor(rank,name,age,finalWorth,year,category,source,country,city,selfMade,gender,birthday,bio,about,picture){
            this.rank= rank;
            this.name=name;
            this.age=age;
            this.finalWorth=finalWorth;
            this.year=year;
            this.category=category;
            this.source=source;
            this.country=country;
            this.city=city;
            this.selfMade=selfMade;
            this.gender=gender;
            this.birthday=birthday;
            this.bio=bio;
            this.about=about;
            this.state=null;
            this.picture="./database/pics/"+picture;

	}
    
    compare(other){
        if (other instanceof Billioner){
            return (this.rank>other.rank?-1:1);
        }
        return null;
    }
    equals(other){
        return (other instanceof Billioner&&other.name==this.name);
    }  

}