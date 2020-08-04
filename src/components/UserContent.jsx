import React from "react";

function UserContent(props) {
  return (
    <>
      <div className='mainContent p-4 mt-5 mb-4 box-shadow '>
        <div className='d-flex justify-content-between'>
          <h4>About</h4>
        </div>
        <div>
          {props.profileInfo.about ? (
            <p>{props.profileInfo.about}</p>
          ) : (
            <p>This user do not have about infos.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default UserContent;
