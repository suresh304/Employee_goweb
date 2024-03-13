import React from "react";
import "../App.css";

const ProfileCard = (empInfo) => {
  return (
    <div className="profile_card">
      <img
        src="https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg"
        alt="no img"
        style={{ width: "300px", height: "300Px", borderRadius: "50%" }}
      />
      <h1>{empInfo.employee_name}</h1>
      <table>
        {Object.keys(empInfo || {}).map((key, ind) => (
          <tr>
            <td>
              <b>{key}</b>
            </td>
            <td>
              <span>{empInfo[key]}</span>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default ProfileCard;
