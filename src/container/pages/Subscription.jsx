import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
const CourseUrl = `/api/course/`;
import axios from "axios";
import { useSelector } from "react-redux";
import PaystackPop from "@paystack/inline-js";
import Loader from "../../components/Preloader/Loader";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";

const Subscription = ({ totalAmount }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [active, setActive] = useState(1);
  const [mainData, setMainData] = useState([]);
  const [perMonth, setPerMonth] = useState("");
  const [monthAmount, setMountAmount] = useState("");

  const queryFunction = useQuery({
    queryKey: ["coursesRandom"],
    queryFn: async () => {
      const res = await axios.get(`${CourseUrl}course-all`);
      return res.data;
    },
  });

  TODO: "REMINDERS";
  // Ensure mainData state reflects the latest fetched data(queried)
  useEffect(() => {
    if (queryFunction.isSuccess && queryFunction.data) {
      setMountAmount(queryFunction.data.monthFee);
      setPerMonth(queryFunction.data.admission);
      setMainData(queryFunction.data.classes);
    }
  }, [queryFunction.isSuccess, queryFunction.data]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    guardian: "",
    parentContact: "",
    photoUrl: "",
    address: "",
    courses: [],
    admissionPer: "",
    admissionThird: "",
    admission: "",
    month: "",
    amount: monthAmount,
    totalCosts: 0,
    perMonth: 0,
    thirdMonth: 0,
    monthFee: monthAmount,
  });

  const activeTabToggler = (index) => {
    setActive(index);
  };
  const handleSelection = (index) => {
    const selectedIndex = selectedClasses.findIndex(
      (item) => item.index === index
    );
    if (selectedIndex === -1) {
      const selectedClass = mainData.find((item) => item.index === index);
      setSelectedClasses([...selectedClasses, selectedClass]);
      setFormData({
        ...formData,
        courses: [...formData.courses, selectedClass],
      });
    } else {
      const updatedClasses = selectedClasses.filter(
        (item) => item.index !== index
      );
      setFormData({
        ...formData,
        courses: updatedClasses,
      });
      setSelectedClasses(updatedClasses);
    }
  };
  const isClassSelected = (index) => {
    return selectedClasses.some((item) => item.index === index);
  };
  useEffect(() => {
    if (active == 1 && perMonth !== "") {
      setFormData({
        ...formData,
        admissionThird: 0,
        admissionPer: 0,
        perMonth: Number(monthAmount),
        month: 1,
        admission: Number(0),
        monthFee: Number(monthAmount),
      });
    } else if (active == 2) {
      setFormData({
        ...formData,
        admissionThird: 0,
        admission: 0,
        monthFee: Number(monthAmount) * 2,
        admissionPer: 0,
        thirdMonth: Number(monthAmount) * 2,
        month: 3,
      });
    }
  }, [active, perMonth, monthAmount]);
  const [amount, setAmount] = useState(Number(monthAmount));
  useEffect(() => {
    const prices = selectedClasses.map((item) => {
      return {
        price: Number(item.price),
        admission: item.admission,
      };
    });

    let priceAmount = 0;

    prices.forEach((price) => {
      if (isNaN(price.admission)) {
        price.admission = 0;
      }
      if (active == 1) {
        priceAmount += Number(price.price * 1) + Number(price.admission * 0);
      } else {
        priceAmount += Number(price.price * 3) + Number(price.admission * 0);
      }
    });

    setAmount(priceAmount);
    setFormData({ ...formData, courseAmounts: priceAmount });
  }, [amount, selectedClasses, formData.admission, active, formData.monthFee]);
  /* USER */
  const { user } = useSelector((state) => state.user);
  /* USER */

  const courseRegisterMutation = useMutation({
    mutationKey: "courseRegistration",
    mutationFn: (data) => {
      return axios.post("/api/course/register-course", data);
    },
  });
  const cancelRegistration = useMutation({
    mutationKey: "cancelRegistration",
    mutationFn: (courseName) => {
      return axios.delete(`/api/course/cancel-subscription/${courseName}`);
    },
  });

  const failedPayment = async (courseName) => {
    try {
      const cancel = await cancelRegistration.mutateAsync(courseName);
      // Further actions or error handling based on cancellation response
    } catch (error) {
      console.error("Cancellation failed:", error);
      // Handle cancellation failure
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedClasses.length == 0) {
        toastError("Select a class");
        return;
      }
      if (!formData.month) {
        return;
      }

      const courseRes = await courseRegisterMutation.mutateAsync({
        courses: selectedClasses,
        month: formData.month,
      });

      if (!courseRes) {
        return;
      }

      const payStack = new PaystackPop();
      payStack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_KEY,
        amount: formData.courseAmounts * 100,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        onClose: function () {
          // No need to call failedPayment here since the registration succeeded
          selectedClasses.forEach(async (item) => {
            if (item.name) {
              await failedPayment(item.name);
            }
          });
        },
        callback: async function (response) {
          let message = "Payment complete! Reference: " + response.reference;
          toastSuccess(message);
          if (response.status === "success") {
            // Proceed with registered classes since payment was successful
            toastSuccess("Payment Success");
          } else {
            // Cancel registration for each class if payment failed or was canceled
            // Rollback the course registration
            selectedClasses.forEach(async (item) => {
              if (item.name) {
                await failedPayment(item.name);
              }
            });
          }
        },
      });
    } catch (error) {
      console.log(error?.response?.data?.message);
      toastError(error?.response?.data?.message);
    }
  };

  return (
    <div className="content__whole profile__page subscribe">
      {courseRegisterMutation.isPending && <Loader />}
      {queryFunction.isLoading && <Loader />}
      <div className="subscribe__header">
        <h3>Flexible Class Plan & Pricing</h3>
        <p className="info__regis">
          You are not charged for extra fees for admission
        </p>
      </div>
      <div className="sum___container">
        <div className="summary__form ">
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
          <h4>Check Out</h4>
          <div className="check__out">
            <p className="bill__month flex-row">
              <span>
                {active == 1
                  ? "One Month Billing Basis"
                  : active == 2
                  ? "3 Months Billing Basis"
                  : ""}
              </span>
            </p>

            {/* INDIVIDUAL CLASS GOES HERE */}
            <div className="individual__class bill__month">
              <h4>Selected Classes</h4>
              <ul>
                {selectedClasses?.map((item, index) => {
                  return (
                    <li key={index}>
                      <span>{item.name}</span>

                      <span>
                        GHS{" "}
                        {active == 1
                          ? Number(+item.price * 1)
                          : active == 2
                          ? Number(+item.price * 3)
                          : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="totalAmounts bill__month">
              <span>Total Amounts:</span>
              <span>GHS {amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="card__course-sub">
            <div className="ind__class-sub">
              {mainData?.map((classItem, index) => (
                <div key={classItem.index} className="class__card">
                  <div className="class__header flex-row">
                    <p>{classItem.name}</p>
                    <span>GHS{classItem.price}</span>
                  </div>
                  <p className="class__desc flex-col">
                    <span className="class__offer-header">What we Offer</span>
                    <span className="class__offer">
                      {classItem.description}
                    </span>
                  </p>
                  <button
                    onClick={() => handleSelection(classItem.index)}
                    className={"class__select"}
                  >
                    {isClassSelected(classItem.index) ? "Unselect" : "Select"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sub__mainBTN">
        <button className="btn__sub" type="submit" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Subscription;
