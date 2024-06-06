export async function getRandomMeal() {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        let meal = data.meals[0];
        return {
            message: `I suggest the following dish: ${meal.strMeal}`,
            meals: [{
                name: meal.strMeal,
                thumb: meal.strMealThumb,
                id: meal.idMeal
            }]
        };
    } catch (error) {
        console.error('Failed to fetch random meal:', error);
        return {
            message: 'Failed to fetch random meal data.',
            meals: []
        };
    }
}

export async function getMealByIngredient(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (!data.meals) {
            return {
                message: `No meals found for ingredient: ${ingredient}`,
                meals: []
            };
        }

        let message = `I suggest the following dishes with ${ingredient}:\n`;
        let meals = data.meals.map(meal => ({
            name: meal.strMeal,
            thumb: meal.strMealThumb,
            id: meal.idMeal
        }));

        meals.forEach(meal => {
            message += `${meal.name},\n`;
        });

        return {
            message,
            meals
        };
    } catch (error) {
        console.error('Failed to fetch meal:', error);
        return {
            message: 'Failed to fetch meal data.',
            meals: []
        };
    }
}

export async function getMealByArea(area) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (!data.meals) {
            return {
                message: `No meals found for this area: ${area}`,
                meals: []
            };
        }

        let message = `I suggest the following dishes with ${area}:\n`;
        let meals = data.meals.map(meal => ({
            name: meal.strMeal,
            thumb: meal.strMealThumb,
            id: meal.idMeal
        }));

        meals.forEach(meal => {
            message += `${meal.name},\n`;
        });

        return {
            message,
            meals
        };
    } catch (error) {
        console.error('Failed to fetch meal:', error);
        return {
            message: 'Failed to fetch meal data.',
            meals: []
        };
    }
}

export async function getMealById(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (!data.meals) {
            return {
                message: `No meal found with ID: ${id}`
            };
        }

        const meal = data.meals[0];
        let recipe = `Recipe for ${meal.strMeal}:\n\n`;
        recipe += `Category: ${meal.strCategory}\n`;
        recipe += `Area: ${meal.strArea}\n\n`;
        recipe += `Ingredients:\n`;

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient) {
                recipe += `- ${ingredient} - ${measure}\n`;
            }
        }

        recipe += `\nInstructions:\n${meal.strInstructions}\n`;

        return {
            message: recipe,
            image: meal.strMealThumb
        };
    } catch (error) {
        console.error('Failed to fetch recipe:', error);
        return {
            message: 'Failed to fetch recipe data.',
            image: null
        };
    }
}
