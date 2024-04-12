import React, { useState, useEffect } from "react";
// import "./profilepage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdEditSquare, MdDelete } from "react-icons/md";
import Navbar from "../../components/Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [allSkills, setAllSkills] = useState([]);

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("userToken");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [userSkillNames, setUserSkillNames] = useState([]);

  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!jwtToken) {
          alert("Please Login!!!");
          navigate("/");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };
        const response = await axios.get(
          "http://localhost:3000/user-details",
          config
        );

        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user details", error);
      }
    };

    fetchUserDetails();
  }, [jwtToken, navigate]);

  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const response = await axios.get("http://localhost:3000/fetch-skills");

        setAllSkills(response.data);
      } catch (error) {
        console.log("Failed to fetch all the skills", error);
      }
    };

    fetchAllSkills();
  }, []);

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user-skill-fetch/${userData._id}`
        );

        setUserSkills(response.data);
      } catch (error) {
        console.error("Unable to fetch the user's skills", error);
      }
    };

    fetchUserSkills();
  }, [userData]);

  useEffect(() => {
    const fetchUserSkillName = async (skillId) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/particular-skill-fetch/${skillId}`
        );
        return response.data.name; // Return the skill name
      } catch (error) {
        console.error("Unable to fetch skill name", error);
        return ""; // Return empty string if there's an error
      }
    };

    const fetchUserSkillsNames = async () => {
      try {
        const namesPromises = userSkills.map((skill) =>
          fetchUserSkillName(skill.skillId)
        );
        const skillNames = await Promise.all(namesPromises);
        setUserSkillNames(skillNames);
      } catch (error) {
        console.error("Failed to fetch user skill names", error);
      }
    };

    fetchUserSkillsNames();
  }, [userSkills]);

  const handleSkillChange = (e) => {
    setSelectedSkills([...selectedSkills, e.target.value]);
  };

  const handleDeleteSkill = (skillName) => {
    const updatedSkills = selectedSkills.filter((skill) => skill !== skillName);
    setSelectedSkills(updatedSkills);
  };

  const handleSubmit = async () => {
    // Get all details of the selected skills
    let userSkills = allSkills.filter((skill) =>
      selectedSkills.some((selectedSkill) => selectedSkill === skill.name)
    );

    try {
      for (const userSkill of userSkills) {
        const response = await axios.post(
          `http://localhost:3000/user-skill-add/${userData._id}`,
          { skillId: userSkill._id }
        );

        toast.success("Skill added for the user", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      if (error.response.status === 500) {
        toast.error("Skill already present for the user", {
          autoClose: 1000,
        });
      } else {
        toast.error("Failed to add skill for the user", {
          autoClose: 1000,
        });
      }
    }
  };

  return userToken ? (
    <>
      <Navbar />
      <div className="bg-gray-100 w-full flex justify-center items-center">
        <div className="w-[60%] px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={userData.name}
              disabled
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={userData.email}
              disabled
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700"
            >
              Designation:
            </label>
            <input
              type="text"
              id="designation"
              value={userData.designation}
              disabled
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700"
            >
              Skills:
            </label>
            <select
              id="skills"
              multiple
              value={selectedSkills}
              onChange={handleSkillChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            >
              {allSkills.map((skill) => (
                <option key={skill._id} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
            <div className="selected-skills-container mt-2">
              {selectedSkills.map((skill) => (
                <div className="flex items-center mb-2" key={skill}>
                  <input
                    type="text"
                    id="selected-skills"
                    value={skill}
                    disabled
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <MdDelete
                    className="ml-2 text-red-600 cursor-pointer"
                    onClick={() => handleDeleteSkill(skill)}
                  >
                    Delete
                  </MdDelete>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="currentSkills"
              className="block text-sm font-medium text-gray-700"
            >
              Current Skills:
            </label>
            <div className="flex flex-wrap gap-4">
              {userSkillNames.map((skill) => (
                <div className="flex items-center mb-2" key={skill}>
                  <input
                    type="text"
                    id="currentSkills"
                    value={skill}
                    disabled
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  ) : (
    <h1 className="text-black text-4xl flex justify-center">
      you are not an user!!!
    </h1>
  );
};

export default ProfilePage;
