import ageChart from "./ageChart.js";
import BillionersList from './billionersList.js';
import genderChart from './genderChart.js';

export default class VizUpdater{

    constructor(map,dialog){
        this.gc=new genderChart();
        this.ac=new ageChart();
        this.bl=new BillionersList(map,dialog);
    }

    update(data){
        this.gc.update(data.splitGender());
        this.ac.update(data.splitAge());
        this.bl.update(data.billioners.values());
    }
}