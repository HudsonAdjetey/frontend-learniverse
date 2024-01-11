import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BasicInfo from "../../components/basicInfo/BasicInfo";
import ClassInfo from "../../components/classInfo/ClassInfo";
import ParentalInfo from "../../components/parentalInfo/ParentalInfo";
import Payment from "../../components/payment/Payment";
import { getStepText } from "./SignUp";
import PaystackPop from "@paystack/inline-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../app/userSlice";
import { toastError, toastSuccess } from "../../components/toastify/toastMes";
const CourseUrl = `/api/course/`;

export const SignUp = () => {
  // Get all classes for the class list.
  const [lineColor, setLineColor] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [active, setActive] = useState(1);

  const dispatch = useDispatch();

  // Mutations for API calls to backend server
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
    amount: 0,
    totalCosts: 0,
    perMonth: 0,
    thirdMonth: 0,
    monthFee: 0,
    username: "",
  });

  const [mainData, setMainData] = useState([]);
  const [perMonth, setPerMonth] = useState("");
  const [monthAmount, setMountAmount] = useState("");
  const queryFunction = useQuery({
    queryKey: ["getCourses"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${CourseUrl}/course-all`);
        return res.data;
      } catch (error) {
        throw new Error("Failed to fetch courses");
      }
    },
  });

  TODO: "REMINDERS";
  // Ensure mainData state reflects the latest fetched data(queried)
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClass, setFilteredClass] = useState([]);
  useEffect(() => {
    if (queryFunction.isSuccess && queryFunction.data) {
      setMountAmount(queryFunction.data.monthFee);
      setPerMonth(queryFunction.data.admission);
      setMainData(queryFunction.data.classes);
    }
  }, [queryFunction.isSuccess, queryFunction.data]);

  // Now mainData state should contain the fetched data nothing else

  const handleSearchValue = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!mainData) {
      return;
    }

    const filteredClasses = mainData
      .filter((item) => {
        if (searchQuery === "") {
          return true;
        } else if (
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return true;
        }
        return false;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setFilteredClass(filteredClasses);
  }, [searchQuery, mainData]);

  const handleInputs = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [number, setPhoneNumber] = useState();

  const handleInputChange = (value) => {
    validateNumber(setPhoneNumber(value));
    setFormData({ ...formData, contact: value });
  };

  const handleParentContact = (value) => {
    setFormData({ ...formData, parentContact: value });
  };

  const validateNumber = (numberPhone) => {
    const phoneNumberValidate = /^\d{10}$/;
    if (phoneNumberValidate.test(Number(numberPhone))) {
      return true;
    } else {
      return false;
    }
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

  const [amount, setAmount] = useState();

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
        priceAmount += Number(price.price * 1) + Number(price.admission);
      } else {
        priceAmount += Number(price.price * 3) + Number(price.admission);
      }
    });

    setAmount(priceAmount);
    setFormData({ ...formData, courseAmounts: priceAmount });
  }, [amount, selectedClasses, formData.admission, active, formData.monthFee]);

  const activeTabToggler = (index) => {
    setActive(index);
  };

  useEffect(() => {
    if (active == 1 && perMonth !== "") {
      setFormData({
        ...formData,
        admissionPer: Number(perMonth),
        perMonth: Number(monthAmount),
        month: 1,
        admission: Number(perMonth),
        monthFee: Number(monthAmount),
      });
    } else if (active == 2) {
      setFormData({
        ...formData,
        monthFee: Number(monthAmount) * 2,
        thirdMonth: Number(monthAmount) * 2,
        month: 3,
      });
    }
  }, [active, perMonth, monthAmount]);
  const [successStatus, setSuccessStatus] = useState();
  const URL = `/api/auth/`;
  const mutation = useMutation({
    mutationKey: "signUp",
    mutationFn: (data) => {
      return axios.post(`${URL}register`, data);
    },
  });

  const courseRegisterMutation = useMutation({
    mutationKey: "courseRegistration",
    mutationFn: (data) => {
      return axios.post("/api/course/register-course", data);
    },
  });
  const cancelRegistration = useMutation({
    mutationKey: "cancelRegistration",
    mutationFn: (id) => {
      return axios.delete(`/api/course/cancel-course/${id}`);
    },
  });
  const removeStudent = useMutation({
    mutationFn: (id) => {
      return axios.delete(`${URL}delete-student/${id}`);
    },
  });
  const failedPayment = async (courseId) => {
    try {
      const cancel = await cancelRegistration.mutateAsync(courseId);
      // Further actions or error handling based on cancellation response
    } catch (error) {
      console.error("Cancellation failed:", error);
      // Handle cancellation failure
    }
  };

  const removeStudentUser = async (idValue) => {
    try {
      const deleteStudent = await removeStudent.mutateAsync(idValue);
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await mutation.mutateAsync(formData);

      const courseRes = await courseRegisterMutation.mutateAsync({
        courses: selectedClasses,
        month: formData.month,
      });
      const idValue = res?.data?.data?.userID;

      // let idValue = courseRes.data.data._id;
      if (!courseRes) {
        toastError("Something went wrong");
        return;
      }
      const payStack = new PaystackPop();
      payStack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_KEY,
        amount: formData.courseAmounts * 100,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.firstName,
        ref: "" + Math.floor(Math.random() * 1000000000 + 1),
        onClose: function () {
          failedPayment(idValue);
          // selectedClasses.forEach(async (item) => {
          //   if (item.name) {
          //     await failedPayment(item.name);
          //   }
          // });
          removeStudentUser(idValue);
          toastError("Failed");
        },
        callback: function async(response) {
          let message = "Payment complete! Reference: " + response.reference;
          toastSuccess(message);
          if (response.status == "success") {
            dispatch(setUser(res.data.data));
            <Navigate to={"/"} replace />;
            navigate("/");
            toastSuccess("Success");
          } else {
            removeStudentUser(idValue);
            failedPayment(idValue);

            toastError("Failed");
          }

          // Execute different actions or show error messages
        },
      });
    } catch (error) {
      console.log(error);
      toastError(error?.response?.data?.message || "An Error Occurred!");
      if (error?.response?.data?.errors[0].msg) {
        toastError(error.response.data.errors[0].msg);
      }
    }
  };

  const continueLine = () => {
    if (lineColor == 1) {
      if (
        formData.firstName == "" ||
        formData.lastName == "" ||
        formData.email == "" ||
        formData.username == "" ||
        formData.password == "" ||
        formData.contact == ""
      ) {
        toastError("All fields required");
        return;
      }
    }
    if (lineColor == 3) {
      if (selectedClasses.length < 1) {
        toastError("Select at least a class");
        return;
      }
    }
    if (lineColor < 4) {
      setLineColor((prev) => prev + 1);
    }
  };
  const backLine = () => {
    if (lineColor > 0) {
      setLineColor((prev) => prev - 1);
    }
  };

  return (
    <section className="signUp">
      <div className="topHeader flex-row">
        <div className="logo__name">
          <h1>
            <Link to={"/home"}>
              Learn<span>iverse</span>
            </Link>{" "}
          </h1>
        </div>
        <div className="newUser__link">
          <span>Already have an account</span>
          <Link to={"/login"}>Sign In</Link>
        </div>
      </div>

      {/* TABS */}
      <ul className="tabs__container">
        {[1, 2, 3, 4].map((step) => (
          <li key={step}>
            <span className={`number ${lineColor === step ? "active" : ""}`}>
              {lineColor > step ? (
                <i className="bi bi-check-lg changeColor"></i>
              ) : (
                `0${step}`
              )}
            </span>
            <span className="text_info">{getStepText(step)}</span>
            {step < 4 && (
              <span className={`line ${lineColor === step ? "active" : ""}`} />
            )}
          </li>
        ))}
      </ul>
      {/* FORM CONTAINER */}
      <div className="form__pagesInfo">
        <BasicInfo
          line={lineColor}
          firstName={formData.firstName}
          setFirstName={setFirstName}
          setLastName={setLastName}
          lastName={formData.lastName}
          email={formData.email}
          contact={formData.number}
          handleInputs={handleInputs}
          handleInputChange={handleInputChange}
          password={formData.password}
          username={formData.username}
        />
        {/* PARENTAL INFO */}
        <ParentalInfo
          line={lineColor}
          handleInputChange={handleParentContact}
          parentContact={formData.parentContact}
          address={formData.address}
          handleInputs={handleInputs}
          guardian={formData.guardian}
        />

        {/* CLASS INFO */}
        <ClassInfo
          line={lineColor}
          selectedClasses={selectedClasses}
          dataInfo={filteredClass}
          isClassSelected={isClassSelected}
          handleSelection={handleSelection}
          search={searchQuery}
          handleInputs={handleSearchValue}
        />

        {/* PAYMENT */}
        <Payment
          line={lineColor}
          selectedClass={formData.courses}
          admissionPer={formData.admissionPer}
          activeTabToggler={activeTabToggler}
          setActive={setActive}
          active={active}
          admissionThird={formData.admissionThird}
          monthFee={formData.perMonth}
          threeMonth={formData.thirdMonth}
          totalAmount={amount}
        />

        <div className="pro__select flex-row">
          {lineColor > 1 ? (
            <button className="proceedBtn" onClick={backLine}>
              Back
            </button>
          ) : null}

          <button
            onClick={continueLine}
            style={lineColor <= 3 ? { display: "block" } : { display: "none" }}
            className="proceedBtn"
          >
            {lineColor <= 3 && "Proceed"}
          </button>
          {lineColor == 4 && (
            <button className="proceedBtn" onClick={onSubmit}>
              Register
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
