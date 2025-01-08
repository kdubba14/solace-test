"use client";

import { advocateData } from "@/db/seed/advocates";
import { useDebounce } from "@/utils/useDebounce";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [advocates, setAdvocates] = useState<typeof advocateData>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // TODO: Make dynamic and use virtualized list for performance & UI

  useEffect(() => {
    fetch(
      `/api/advocates?page=${currentPage}&limit=${itemsPerPage}&q=${debouncedSearchTerm}`,
      { cache: "force-cache" }
    ).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setTotalPages(jsonResponse.totalPages);
      });
    });
  }, [currentPage, itemsPerPage, debouncedSearchTerm]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
  };

  const onReset = () => {
    setSearchTerm("");
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
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
          placeholder="Search"
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
          {advocates.map((advocate, idx) => {
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
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
