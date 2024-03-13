import React, { useEffect, useState } from "react";
import "../App.css";
import ProfileCard from "./ProfileCard";

export const Empdata = () => {
  const [data, setData] = useState([]);
  const [activeInd,setActiveInd] = useState()
  const [empInfo, setEmpInfo] = useState();
  const getData = async () => {
    const res = await fetch("./data.json");
    const resData = await res.json();
    setData(resData.data);
  };
  useEffect(() => {
    getData();
  }, []);
  const handleClick = (emp,ind)=>{
    setEmpInfo(emp)
    setActiveInd(ind)
  }

  return (
    <div className="emp__layout">
      {console.log(data)}
      <div className="header">
        <center>
          <h1>Employee Database Management</h1>
        </center>
      </div>
      <div className="container">
        <div className="container-employees">
          {data.length &&
            data.map((emp, ind) => (
              <div className={`single_emp_name ${ind === activeInd ? 'active' : ''}`} onClick={() => handleClick(emp,ind)}>
                {emp.employee_name}
              </div>
            ))}
        </div>
        <div className="container-empInfo">
          <center>
            <h1>Profile</h1>
          
          <ProfileCard {...empInfo}/>
          </center>

        </div>
      </div>
    </div>
  );
};
