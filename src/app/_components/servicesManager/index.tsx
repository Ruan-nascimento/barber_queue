"use client";
import { useState } from "react";
import { ServicesModal } from "../servicesModal";

export const ServicesManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-4 bg-blue-600 absolute right-10 bottom-10 text-white rounded hover:bg-blue-700 hover:shadow-2xl transition-all duration-200 cursor-pointer"
      >
        Serviços
      </button>
      {isModalOpen && <ServicesModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};