'use client';
import React, { useState } from "react";
import {
  Hotel,
  Home,
  TreePine as Resort,
  Leaf as Farmhouse,
  Sun as Beachhouse,
  Home as Cottage,
  Building2 as Apartment
} from "lucide-react";

// Define the type for propertyTypes
interface PropertyType {
  name: string;
  icon: React.ReactNode;
}

const propertyTypes: PropertyType[] = [
  { name: "Hotel", icon: <Hotel /> },
  { name: "Home", icon: <Home /> },
  { name: "Resort", icon: <Resort /> },
  { name: "Farmhouse", icon: <Farmhouse /> },
  { name: "Beachhouse", icon: <Beachhouse /> },
  { name: "Cottage", icon: <Cottage /> },
  { name: "Apartment", icon: <Apartment /> },
];

const PropTypesSelect: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("");

  const handleClick = (propertyName: string): void => {
    setSelectedType(propertyName); // Set the selected property on click
    console.log(propertyName); // Log property name on click
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "75%", // Set a max width to center the items better
        maxHeight: '85%',
        margin: "0 auto",
        borderRadius: "10px",
      }}
    >
      {propertyTypes.map((type) => (
        <div
          key={type.name}
          onClick={() => handleClick(type.name)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            textAlign: "center",
            transition: "transform 0.2s", // Smooth pop-up effect
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)"; // Scale up slightly on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"; // Reset scale when hover ends
          }}
        >
          <div
            style={{
              fontSize: "24px", // Icon size
              color: "#000",
              transform: selectedType === type.name ? "scale(1.2)" : "scale(1)", // Scale icon if selected
              transition: "transform 0.2s",
            }}
          >
            {type.icon}
          </div>
          <span
            style={{
              fontSize: "12px",
              marginTop: "5px",
              position: "relative",
              fontWeight: selectedType === type.name ? "bold" : "normal", // Bold text if selected
            }}
            onMouseEnter={(e) => {
              if (selectedType !== type.name) {
                e.currentTarget.style.setProperty('--underline-color', 'gray');
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.removeProperty('--underline-color');
            }}
          >
            {type.name}
            <div
              style={{
                position: "absolute",
                bottom: "-5px", // Position underline below text
                left: 0,
                height: "2px",
                width: "100%",
                backgroundColor: selectedType === type.name ? "black" : "var(--underline-color, transparent)", // Black underline if selected, gray if hovered
                transition: "background-color 0.2s",
                borderRadius: "5px", // Rounded edges for the underline
              }}
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default PropTypesSelect;
