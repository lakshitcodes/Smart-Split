"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

const CategorySelector = ({ categories, onChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  //   Handle when a category is selected
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);

    // Only call onChange if it exists and the value has been changed
    if (onChange && categoryId !== selectedCategory) {
      onChange(categoryId);
    }
  };

  //   If no categories or empty categories array
  if (!categories || categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No categories available.</p>
    );
  }

  useEffect(() => {
    //   Set default value if not already set
    if (!selectedCategory && categories.length > 0) {
      // Set the first category as default or find if any
      const defaultCategory =
        categories.find((cat) => cat.isDefault) || categories[0];

      // Set the default category without triggering a re-render loop
      setTimeout(() => {
        setSelectedCategory(defaultCategory.id);
        if (onChange) {
          onChange(defaultCategory.id);
        }
      }, 0);
    }
  }, []);

  return (
    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center gap-2">
              <span>{category.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;
