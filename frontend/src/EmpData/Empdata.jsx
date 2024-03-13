import React, { useEffect, useState } from "react";
import "../App.css";
import ProfileCard from "./ProfileCard";
import Model from "./Model";

export const Empdata = () => {
  const [data, setData] = useState([]);
  const [activeInd, setActiveInd] = useState(0);
  const [empInfo, setEmpInfo] = useState();
  const [showModel, setShowModel] = useState(false);
  const [showDelModel, setShowDelModel] = useState(false);
  const [newEmpData, setNewEmpData] = useState({
    id: "",
    employee_name: "",
    employee_salary: "",
    employee_age: "",
  });
  const submitHandler = async () => {
    const [id, employee_name, employee_salary, employee_age] = [
      "id",
      "employee_name",
      "employee_salary",
      "employee_age",
    ].map((ele, ind) => document.getElementsByClassName("form")[0][ind].value);
    const newEmp = {
      id: parseInt(id),
      employee_name: employee_name,
      employee_salary: parseInt(employee_salary),
      employee_age: parseInt(employee_age),
    };

    try {
      const response = await fetch("http://localhost:8080/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmp),
      });

      if (response.ok) {
        console.log("Employee added successfully!");
        setNewEmpData(newEmp);
        setShowModel(false);

        // Handle success, e.g., show a success message or redirect
      } else {
        console.error("Failed to add employee:", response.statusText);
        // Handle failure, e.g., show an error message
      }
    } catch (error) {
      console.error("Error adding employee:", error.message);
      // Handle error, e.g., show an error message
    }
  };

  const cancelHandle = () => {};
  const delHandler = async (id) => {
    const res = await fetch(`http://localhost:8080/delete/${id}`, {
      method: "delete",
    });
    if (res.status !== 200) {
      console.log("something went wrong in deleting the employee");
      location.reload();
    } else {
      console.log("delted employee successfully");
      location.reload();
    }
  };
  const getData = async () => {
    const res = await fetch("http://localhost:8080/employees");
    const resData = await res.json();
    setData(resData);
    setEmpInfo(resData[0])
  };
  useEffect(() => {
    getData();
  }, [newEmpData]);
  const handleSelect = (emp, ind) => {
    setEmpInfo(emp);
    setActiveInd(ind);
  };

  return (
    <>
      {showModel && (
        <Model
          title={"Enter Details"}
          submitHandler={submitHandler}
          setShowModel={setShowModel}
        >
          <form className="form">
            <input type="" placeholder="EnterId" />
            <input type="" placeholder="Enter Name" />
            <input type="" placeholder=" Enter Salary" />
            <input type="" placeholder=" Enter age" />
          </form>
        </Model>
      )}
      <div className={!showModel ? "emp__layout" : "unClickable"}>
        <div className="header">
          <center>
            <h1>Employee Database Management</h1>
            <button onClick={() => setShowModel(true)}>Add Employee</button>
          </center>
        </div>
        <div className="container">
          <div className="container-employees">
            <h1>Employee List</h1>
            <div className="emp__list">
              {data?.length &&
                data.map((emp, ind) => (
                  <div
                    className={`single_emp_name ${
                      ind === activeInd ? "active" : ""
                    }`}
                    onClick={() => handleSelect(emp, ind)}
                  >
                    {emp.employee_name}
                    <button onClick={() => delHandler(emp.id)}>Delete</button>
                  </div>
                ))}
            </div>
          </div>
          <div className="container-empInfo">
            <center>
              <h1>Profile</h1>

              <ProfileCard {...empInfo} />
            </center>
          </div>
        </div>
      </div>
    </>
  );
};
