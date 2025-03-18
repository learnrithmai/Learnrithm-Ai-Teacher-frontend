import React from "react";
import { motion } from "framer-motion";
import { Book, School } from "lucide-react";

export const FloatingElements: React.FC = () => {
  return (
    <>
      <motion.div
        className="fixed top-10 left-10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <Book className="w-12 h-12 text-primary opacity-20" />
      </motion.div>
      <motion.div
        className="fixed bottom-10 right-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      >
        <School className="w-16 h-16 text-primary opacity-20" />
      </motion.div>
    </>
  );
};