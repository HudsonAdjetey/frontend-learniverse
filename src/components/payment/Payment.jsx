import React, { memo, useEffect, useState } from "react";

const Payment = memo(
  ({
    line,
    selectedClass,
    perMonth,
    thirdMonth,
    monthFee,
    threeMonth,
    admissionThird,
    admissionPer,
    active,
    setActive,
    activeTabToggler,
    totalAmount,
  }) => {
    const [admission, setAdmission] = useState(0);
    useEffect(() => {
      if (selectedClass.length > 0) {
        let sum = 0;
        for (let i of selectedClass) {
          if (isNaN(i.admission)) {
            i.admission = 0;
          }
          sum += Number(+i.admission);
        }
        setAdmission(sum);
      }
    }, [selectedClass]);
    return (
      <div className={line == 4 ? "activeTab" : "unActive"}>
        <div className="basicInfo__container ">
          <h3 className="basic__infoHeader">Subscribe to class</h3>

          <div className="payment__select">
            <div
              className={`card ${active == 1 ? "tabSelect" : ""}`}
              onClick={() => activeTabToggler(1)}
            >
              <h4>Bill monthly</h4>
            </div>
            <div
              className={`card ${active == 2 ? "tabSelect" : ""}`}
              onClick={() => activeTabToggler(2)}
            >
              <h4>Bill every 3 months</h4>
            </div>
          </div>
          <div className="subContent_checkout">
            <h3>Check Out</h3>
            <p className="billing__sys pay__index">
              {active == 1
                ? "Monthly Billing Basis"
                : "Three Months Billing Basis"}
            </p>
            <p className="admissionCheckOut pay__index">
              <span className="show_nameAdmission">Admission</span>
              <span className="show_admission">
                GHS {admission?.toFixed(2) || 0}
              </span>
            </p>
            <div className="all_ind">
              <h3>Selected Classes</h3>
              <ul>
                {selectedClass?.map((item, index) => {
                  return (
                    <li key={index}>
                      <span>{item.name}</span>

                      <span>
                        GHS{" "}
                        {active == 1
                          ? Number(+item.price * 1)
                          : Number(+item.price * 3)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="totalAmounts bill__month">
                <span>Total Amounts:</span>
                <span>GHS {totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default Payment;
