import axios from "axios";
export default async function setCrashes(){

    var critical_crash_array = await setCriticalCrash();
    var fatal_crash_array= await setFatalCrash();
    var warning_crash_array= await setWarningCrash();
    // crash_array["CRITICAL"]= critical_crash_array;
    // crash_array["FATAL"]=fatal_crash_array;
    // crash_array["WARNING"]= warning_crash_array;
    console.log("Crashes being set to cookies");
    // return crash_array;
    
    return [critical_crash_array,warning_crash_array,fatal_crash_array];
}
 async function setCriticalCrash(){
    var criticalCrash = [];
    // axios.get("http://54.242.124.42:8080/api/getCriticalCrash").then(response=>{
    //     criticalCrash = response.data;
    // })
    const {data} = await axios.get("http://54.242.124.42:8080/api/getCriticalCrash/");
    criticalCrash = data;

    return criticalCrash;
}
 async function setFatalCrash(){
    var fatalCrash = [];
    const {data} = await axios.get("http://54.242.124.42:8080/api/getFatalCrash/");
    fatalCrash = data;
    return fatalCrash;
}
 async function setWarningCrash(){
    var warningCrash = [];
    const {data} = await axios.get("http://54.242.124.42:8080/api/getWarningCrash/");
    warningCrash = data;
    return warningCrash;
}
