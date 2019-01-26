import React from 'react'

const AddRecipe = () => {
  return (
    <div className="App">
      <h2 className="App">Add Recipe</h2>
      <form className="form">
        <input type="text" name="name" placeholder="Recipe Name" onChange={this.inputChangedHandler} />
        <select name="category" onChange={this.inputChangedHandler}>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
        <input type="text" name="description" placeholder="Add description" onChange={this.inputChangedHandler} />
        <textarea name="instructions" onChange={this.inputChangedHandler} placeholder="Add instructions" ></textarea>
      </form>
    </div>
  )
}

export default AddRecipe
