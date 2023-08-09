export default class Sorter{
    constructor(){}

    sort(x){
        var y=Array.from(x.keys()).sort(function(a,b){
            return(x.get(a).finalWorth>x.get(b).finalWorth)?-1:1;
        });

        var z=new Map();
        for(var i of y){
            z.set(i,x.get(i));
        }
        return z;
    }

    backsort(x){
        var y=Array.from(x.keys()).sort(function(a,b){
            return(x.get(a).finalWorth<x.get(b).finalWorth)?-1:1;
        });

        var z=new Map();
        for(var i of y){
            z.set(i,x.get(i));
        }
        return z;
    }
    
}