import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FilterComponent = ({handleFilterChange}) => {
  const categoriesOptions = [
    { id: "Full Stack Development", label: "Full Stack Development" },
    { id: "Frontend Development", label: "Frontend Development" },
    { id: "Backend Development", label: "Backend Development" },
    { id: "Mobile App Development", label: "Mobile App Development" },
    { id: "Game Development", label: "Game Development" },
    { id: "Data Science", label: "Data Science" },
    { id: "Machine Learning", label: "Machine Learning" },
    { id: "Deep Learning", label: "Deep Learning" },
    { id: "Artificial Intelligence", label: "Artificial Intelligence" },
    { id: "Natural Language Processing", label: "Natural Language Processing" }
  ];


  const [categories, setcategories] = useState([])
  const [sortPrice, setsortPrice] = useState("");

  const handleCategoryChange = (categoryId)=>{
    setcategories((prevCategories)=>{
      const nextCategories = prevCategories.includes(categoryId) ? prevCategories.filter((id)=>id!==categoryId) : [...prevCategories, categoryId] 
      handleFilterChange(nextCategories,sortPrice)
      return nextCategories;
    })
  }

  const handleSortChange = (selectedValue) => {
    setsortPrice(selectedValue);
    handleFilterChange(categories,selectedValue);
  }

  return (
    <Card className="p-4">
      <CardContent className="space-y-6 p-0">
        <div>
          <Label className="mb-2 block">Sort By Price</Label>
          <Select onValueChange={handleSortChange} >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Low to High">Low to High</SelectItem>
                <SelectItem value="High to Low">High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Category</Label>
          <div className="space-y-2">
            {categoriesOptions.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox id={category.id} onCheckedChange={()=>handleCategoryChange(category.id)} />
                <Label htmlFor={category.id}>{category.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterComponent;
