import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InfoModal from "../../components/Modal/InfoModal";
import ClassModal from "../../components/Modal/ClassModal";
import AlertModal from "../../components/alertModal/AlertModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allClass } from "../../api/FetchClass";
import axios from "axios";

import { useSelector } from "react-redux";

import HangClassModal from "../../components/Modal/HangClassModal";
import Loader from "../../components/Preloader/Loader";
const Classes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openCreate, setOPenCreate] = useState(false);

  const [id, setId] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [listData, setListData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add event listener for keydown event when modal is open
    if (isOpen || openCreate) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    }
    return () => {
      // Cleanup by enabling scrolling when component unmounts
      document.body.style.overflow = "auto";
    };
  }, [isOpen, openCreate]);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };
  const alertConfirm = (index) => {
    setIsAlert(!isAlert);
  };

  const URL = `/api/course`;
  const queryClient = useQueryClient();

  const [classData, setClassData] = useState([]);

  const queryFunction = useQuery({
    queryKey: ["class-all-fetched"],
    queryFn: async () => {
      const allClasses = await axios.get(`${URL}/course-all`);

      return allClasses;
    },
  });

  useEffect(() => {
    if (queryFunction.isSuccess) {
      const data = queryFunction.data.data.classes;
      setClassData(data);
    }
  }, [queryFunction.data]);
  const { user } = useSelector((state) => state.user);

  const editToggle = (_id) => {
    setToggle(!toggle);
    setId(_id);
    const obj = classData.find((item) => item._id == _id);
    setListData({ ...obj, userID: user.userID });
  };
  const handleEditInputs = (e) => {
    setListData({
      ...listData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleEditModal = () => {
    setToggle(!toggle);
  };

  // EDIT MODE
  const queryEdit = useMutation({
    mutationKey: ["edit-class", listData._id],
    mutationFn: async (newInfo) => {
      const res = await axios.put(`${URL}/course-update/${id}`, newInfo);
      return res;
    },
  });
  const confirmEdit = async () => {
    try {
      const res = await queryEdit.mutateAsync(listData);
      if (res) {
        setIsAlert(!isAlert);
        setToggle(!toggle);
      }
    } catch (error) {
      console.log(error.message);
      return error;
    }
  };

  useEffect(() => {
    if (queryEdit.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["class-all-fetched"],
        exact: true,
      });
    }
  }, [queryEdit]);

  const [deleteId, setDeleteId] = useState(0);
  const mutateDelete = useMutation({
    mutationKey: "delete-class",
    mutationFn: async (_id) => {
      const res = await axios.delete(`${URL}/course-delete/${_id}`);
      return res;
    },
  });

  const [deleteToggle, setDeleteToggle] = useState(false);
  const toggleDelete = (id) => {
    setDeleteId(id);
    setDeleteToggle(!deleteToggle);
  };
  const confirmCancelDelete = () => {
    setDeleteToggle(!deleteToggle);
  };
  const submitDelete = async () => {
    try {
      await mutateDelete.mutateAsync(deleteId);
      setDeleteToggle(!deleteToggle);
    } catch (error) {
      setDeleteToggle(!deleteToggle);
      console.log(error?.message || error);
    }
  };

  useEffect(() => {
    if (mutateDelete.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["class-all-fetched"],
        exact: true,
      });
    }
  }, [mutateDelete]);
  const [addList, setAddList] = useState({
    name: "",
    admission: "",
    monthFee: "",
    description: "",
    price: "",
    whatsAppLink: "",
  });
  const [alertPop, setAlertPop] = useState(false);

  const showPop = () => {
    setAlertPop(!alertPop);
  };

  const handleValueAddInputs = (e) => {
    setAddList({ ...addList, [e.target.name]: e.target.value });
  };

  const addMutate = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${URL}/course-registration`, data);
      return res;
    },
  });

  const addSubmit = async () => {
    try {
      if (addList.description == "") {
        alert("Description is required!");
        return false;
      }
      if (addList.price) {
        return false;
      }
      const re = await addMutate.mutateAsync(addList);
      if (re) {
        setAddList({
          name: "",
          admission: "",
          monthFee: "",
          description: "",
          whatsAppLink: "",
          price: "",
        });
      }
      setAlertPop(!alertPop);
      setIsOpen(!isOpen);
    } catch (error) {
      setAlertPop(!alertPop);
      console.log(error);
    }
  };
  useEffect(() => {
    if (addMutate.isSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["class-all-fetched"],
        exact: true,
      });
    }
  }, [addMutate]);
  return (
    <div className="content__whole allClass__page">
      {queryEdit.isPending && <Loader />}
      {addMutate.isPending && <Loader />}
      {queryFunction.isLoading && <Loader />}
      <div className="addBtn">
        <button onClick={handleIsOpen}>Add Class</button>
      </div>
      <div className="content__pageMain class__table">
        <table className="table__schedule-main">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Monthly Fee</th>
              <th>Admission Fee</th>
              <th>Price</th>
              <th>Desc</th>
              <th>WhatsApp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>GHS {item.monthFee?.toFixed(2)}</td>
                  <td>GHS {item.admission?.toFixed(2)}</td>
                  <td>GHS {item.price?.toFixed(2)}</td>
                  <td>{item.description}</td>
                  <td>{!item?.whatsAppLink ? "---" : item.whatsAppLink}</td>
                  <td className="t-lin">
                    <span onClick={() => editToggle(item._id)}>Edit</span>
                    <span onClick={() => toggleDelete(item._id)}>Delete</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isOpen && (
        <ClassModal
          handleIsOpen={handleIsOpen}
          cancelConfirm={showPop}
          handleInputs={handleValueAddInputs}
          classData={addList}
        />
      )}
      {toggle && (
        <HangClassModal
          handleIsOpen={toggleEditModal}
          cancelConfirm={alertConfirm}
          data={listData}
          handleInputs={handleEditInputs}
        />
      )}
      {deleteToggle && (
        <AlertModal
          msg={"Confirm to delete"}
          cancelConfirm={confirmCancelDelete}
          acceptConfirm={submitDelete}
        />
      )}

      {isAlert && (
        <AlertModal
          msg={"Confirm to update"}
          cancelConfirm={alertConfirm}
          acceptConfirm={confirmEdit}
        />
      )}
      {alertPop && (
        <AlertModal
          msg={"Confirm to create class"}
          cancelConfirm={showPop}
          acceptConfirm={addSubmit}
        />
      )}
    </div>
  );
};

export default Classes;
