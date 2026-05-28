export const mockUser = {
  name: "Leeon",
  age: 22,
  heightCm: 175,
  weightKg: 72,
  goal: "Body recomposition",
  activityLevel: "Train 3–4 days/week",
  units: "kg / cm",
  diet: "No restriction",
  theme: "Dark",
  plan: "Free Plan",
};

export const mockTargets = {
  calories: 2350,
  protein: 150,
  carbs: 250,
  fat: 75,
};

export const mockToday = {
  dateLabel: "Today · Wed, 28 May",
  caloriesEaten: 1850,
  caloriesRemaining: 500,
  proteinEaten: 92,
  carbsEaten: 170,
  fatEaten: 80,
};

export const mockMeals = [
  {
    id: "meal_001",
    time: "5:00 PM",
    name: "Domino's BBQ Beef Pizza",
    calories: 1850,
    protein: 85,
    carbs: 170,
    fat: 80,
    confidence: "Medium",
  },
];

export const mockMealEstimate = {
  name: "Thin crust BBQ beef pizza",
  calories: 1850,
  calorieRange: "1,600–2,200",
  confidence: "Medium",
  protein: 85,
  carbs: 170,
  fat: 80,
  explanation:
    "Cheese, sausage, beef, BBQ sauce and peri peri sauce increase the calorie estimate. Portion size is assumed to be one whole pizza.",
};

export const mockHistory = [
  { day: "Mon", date: "26 May", calories: "2,150", protein: "142g" },
  { day: "Tue", date: "27 May", calories: "2,800", protein: "180g" },
  { day: "Wed", date: "28 May", calories: "1,850", protein: "92g" },
  { day: "Thu", date: "29 May", calories: "—", protein: "—" },
  { day: "Fri", date: "30 May", calories: "—", protein: "—" },
];

export const mockWeeklySummary = {
  averageCalories: 2266,
  averageProtein: 138,
  loggedDays: "3 / 7",
};