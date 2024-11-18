//jshint esversion:6
module.exports.longdate=todaydate;
function todaydate(){
var today=new Date();
var options={weekday:"long",
    day:"numeric",
    month:"long",
}
const day=today.toLocaleDateString("en-US",options);
return day;
}
module.exports.day=todayday;
function todayday(){
    var today=new Date();
    var options={weekday:"long",
    }
    const day=today.toLocaleDateString("en-US",options);
    return day;
    }