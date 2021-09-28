const  axios=require("axios");

 const Instance = (service,protocol,dataFormat,version,carrier,flightnumber,year,month,day,id,key) => {
  return axios.default.create({
    baseURL: `https://api.flightstats.com/flex/${service}/${protocol}/${version}/${dataFormat}/flight/${carrier}/${flightnumber}/departing/${year}/${month}/${day}}?appId=${id}&appKey=${key}`,
    // baseURL:"https://dummy.restapiexample.com/api/v1/employees"
    // credentials: "include",
    // withCredentials: true,
    // headers
  });
};

module.exports=Instance
