export default class Reader{
    constructor(){   }

    readTextFile(file)
         {
             var data=new Map();
             var rawFile = new XMLHttpRequest();
             rawFile.open("GET", file, false);
             rawFile.onreadystatechange = function ()
             {
                 if(rawFile.readyState === 4)
                 {
                     if(rawFile.status === 200 || rawFile.status == 0)
                     {
                         var allText = rawFile.responseText;
                         data.set("file",allText);
                     }
                 }

             }
             rawFile.send(null);
             return data.get("file");
         }
}


