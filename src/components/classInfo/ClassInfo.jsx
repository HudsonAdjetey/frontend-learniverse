import React, { useState } from "react";
const ClassInfo = ({
  line,
  dataInfo,
  selectedClasses,
  isClassSelected,
  handleSelection,
  search,
  handleInputs,
  searchTrue,
}) => {
  return (
    <div className={line === 3 ? "activeTab" : "unActive"}>
      <div className="sign__class">
        <div className="search__input">
          <input
            type="text"
            placeholder="Search class name..."
            onChange={handleInputs}
            value={search}
          />
        </div>
        <h3 className="basic__infoHeader">Select Class</h3>
        <div className="all__classes flex-row">
          {dataInfo?.map((classItem, index) => (
            <div key={classItem.index} className="class__card">
              <div className="class__header flex-row">
                <p>{classItem.name}</p>
                <span>GHS{classItem.price}</span>
              </div>
              <p className="class__desc flex-col">
                <span className="class__offer-header">What we Offer</span>
                <span className="class__offer">{classItem.description}</span>
              </p>
              <button
                onClick={() => handleSelection(classItem.index)}
                className={"class__select"}
              >
                {isClassSelected(classItem.index) ? "Unselect" : "Select"}
              </button>
            </div>
          ))}
          <p className="emptyClass">
            {dataInfo.length < 1 && "Class not available"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassInfo;
