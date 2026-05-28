export type MealEstimate = {
  name: string;
  calories: number;
  calorieRange: string;
  confidence: "High" | "Medium" | "Low";
  protein: number;
  carbs: number;
  fat: number;
  explanation: string;
};

export function estimateMealFromDescription(description: string): MealEstimate {
  const text = description.toLowerCase();

  if (text.includes("pizza")) {
    return {
      name: description,
      calories: 1850,
      calorieRange: "1,600–2,200",
      confidence: "Medium",
      protein: 85,
      carbs: 170,
      fat: 80,
      explanation:
        "Pizza is usually calorie dense because of cheese, meat toppings, sauce and crust. This estimate assumes one whole medium pizza.",
    };
  }

  if (text.includes("chicken") && text.includes("rice")) {
    return {
      name: description,
      calories: 850,
      calorieRange: "700–1,050",
      confidence: "Medium",
      protein: 55,
      carbs: 95,
      fat: 25,
      explanation:
        "Chicken rice is usually moderate to high in calories depending on rice portion, sauce and cooking oil. This estimate assumes a large single plate.",
    };
  }

  if (text.includes("steak")) {
    return {
      name: description,
      calories: 1100,
      calorieRange: "900–1,350",
      confidence: "Medium",
      protein: 100,
      carbs: 5,
      fat: 75,
      explanation:
        "Steak calories depend heavily on cut, fat level and cooking oil. This estimate assumes a large steak portion.",
    };
  }

  if (text.includes("salad")) {
    return {
      name: description,
      calories: 420,
      calorieRange: "300–650",
      confidence: "Low",
      protein: 25,
      carbs: 30,
      fat: 22,
      explanation:
        "Salads vary a lot depending on dressing, cheese, meat, nuts and oil. This estimate uses a broad range because details are limited.",
    };
  }

  if (text.includes("protein shake") || text.includes("shake")) {
    return {
      name: description,
      calories: 320,
      calorieRange: "220–500",
      confidence: "Medium",
      protein: 35,
      carbs: 25,
      fat: 8,
      explanation:
        "Protein shake calories depend on milk type, powder amount and added ingredients. This estimate assumes protein powder with milk.",
    };
  }

  return {
    name: description || "Unknown meal",
    calories: 750,
    calorieRange: "500–1,000",
    confidence: "Low",
    protein: 35,
    carbs: 75,
    fat: 30,
    explanation:
      "This is a placeholder estimate because the meal description is not specific enough yet. Later, AI will estimate using photo, portion and description.",
  };
}