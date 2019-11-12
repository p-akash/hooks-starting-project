import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const addIngredientHandler = ingredient => {
    fetch("https://react-hook-263eb.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredients),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        return response.json();
      })
      .then(resposeData => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          { id: resposeData.name, ...ingredient }
        ]);
      });
  };
  const removeItemHandler = id => {
    const updatedIngredients = ingredients.filter(d => d.id !== id);
    setIngredients(updatedIngredients);
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeItemHandler}
        ></IngredientList>
      </section>
    </div>
  );
};

export default Ingredients;
