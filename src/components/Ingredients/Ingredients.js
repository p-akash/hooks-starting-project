import React, { useReducer, useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModel from "../UI/ErrorModal";
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error("should not get there!");
  }
};
const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  //const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filterIngredientsHandler = useCallback(filterIngredients => {
    //setIngredients(filterIngredients);
    dispatch({ type: "SET", ingredients: filterIngredients });
  }, []);
  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch("https://react-hook-263eb.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(resposeData => {
        // setIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: resposeData.name, ...ingredient }
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: resposeData.name, ...ingredient }
        });
      })
      .catch(error => {
        setError("Somthing went wrong!");
      });
  };
  const removeItemHandler = id => {
    setIsLoading(true);
    fetch(`https://react-hook-263eb.firebaseio.com/ingredients/${id}.json`, {
      method: "DELETE"
    })
      .then(response => {
        setIsLoading(false);
        // const updatedIngredients = ingredients.filter(d => d.id !== id);
        //setIngredients(updatedIngredients);
        dispatch({ type: "DELETE", id: id });
      })
      .catch(error => {
        setError("Somthing went wrong!");
        setIsLoading(false);
      });
  };
  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModel onClose={clearError}>{error}</ErrorModel>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler} />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeItemHandler}
        ></IngredientList>
      </section>
    </div>
  );
};

export default Ingredients;
