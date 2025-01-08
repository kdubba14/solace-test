"use client";

import { advocateData } from "@/db/seed/advocates";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [advocates, setAdvocates] = useState<typeof advocateData>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<
    typeof advocateData
  >([]);

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advocate.specialties
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        advocate.yearsOfExperience === parseInt(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  }, [advocates, searchTerm]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
  };

  const onReset = () => {
    setSearchTerm("");
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="w-full text-center text-primary text-2xl font-bold">
        Solace Advocates
      </h1>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <input
          className="py-2 px-4 w-[300px] border border-gray-600 focus:border-black"
          onChange={onChange}
          value={searchTerm}
        />
        <button className="ml-2 bg-primary text-white p-2" onClick={onReset}>
          Reset Search
        </button>
      </div>
      <br />
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-primary text-white px-6">
          <tr>
            {[
              "First Name",
              "Last Name",
              "City",
              "Degree",
              "Specialties",
              "Years of Experience",
              "Phone Number",
            ].map((h) => (
              <th
                key={h}
                className="border border-gray-300 px-4 py-2 text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, idx) => {
            return (
              <tr
                key={`${advocate.firstName}-${idx}`}
                className="even:bg-gray-100"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {advocate.firstName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {advocate.lastName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {advocate.city}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {advocate.degree}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {advocate.specialties.map((s, i) => (
                    <div key={i}>{s}</div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {advocate.yearsOfExperience}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {advocate.phoneNumber}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
