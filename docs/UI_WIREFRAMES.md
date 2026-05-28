# NutriSnap AI — Mobile UI Wireframes

## Design Direction

**Style:** premium dark UI, clean Apple-like layout, minimal clutter.
**Primary goal:** make food logging feel faster than MyFitnessPal.
**Core action:** Scan or describe a meal in under 10 seconds.

---

# 1. Splash Screen

```text
┌─────────────────────────────┐
│                             │
│                             │
│          ●                  │
│      NutriSnap AI           │
│                             │
│   Track smarter. Eat better.│
│                             │
│                             │
└─────────────────────────────┘
```

### Notes

* Black / graphite background.
* Simple logo mark above name.
* Short premium tagline.

---

# 2. Welcome Screen

```text
┌─────────────────────────────┐
│                             │
│  NutriSnap AI               │
│                             │
│  AI calorie tracking        │
│  without the manual hassle. │
│                             │
│  [ Continue with Apple ]    │
│  [ Continue with Google ]   │
│  [ Continue with Email  ]   │
│                             │
│  Already have an account?   │
│  Sign in                    │
└─────────────────────────────┘
```

### Notes

* Apple login should be prioritised for iOS.
* Keep copy short and confident.

---

# 3. Onboarding — Goal Selection

```text
┌─────────────────────────────┐
│ Step 1 of 5                 │
│                             │
│ What is your main goal?     │
│                             │
│  [ Lose fat ]               │
│  [ Maintain weight ]        │
│  [ Build muscle ]           │
│  [ Body recomposition ]     │
│                             │
│              [ Next ]       │
└─────────────────────────────┘
```

### Notes

* Body recomposition should be included because many beginners want to build muscle and reduce fat at the same time.

---

# 4. Onboarding — Body Details

```text
┌─────────────────────────────┐
│ Step 2 of 5                 │
│                             │
│ Tell us about you           │
│                             │
│ Age                         │
│ [ 22 ]                      │
│                             │
│ Height                      │
│ [ 175 cm ]                  │
│                             │
│ Weight                      │
│ [ 72 kg ]                   │
│                             │
│ Sex                         │
│ [ Male ▼ ]                  │
│                             │
│              [ Next ]       │
└─────────────────────────────┘
```

---

# 5. Onboarding — Activity Level

```text
┌─────────────────────────────┐
│ Step 3 of 5                 │
│                             │
│ How active are you?         │
│                             │
│  [ Mostly sitting ]         │
│  [ Lightly active ]         │
│  [ Train 3–4 days/week ]    │
│  [ Very active ]            │
│                             │
│              [ Next ]       │
└─────────────────────────────┘
```

---

# 6. Onboarding — Nutrition Target Result

```text
┌─────────────────────────────┐
│ Your starting targets       │
│                             │
│ Calories                    │
│ 2,350 kcal/day              │
│                             │
│ Protein                     │
│ 150 g/day                   │
│                             │
│ These are adjustable later. │
│                             │
│        [ Start Tracking ]   │
└─────────────────────────────┘
```

### Notes

* Avoid pretending the target is perfect.
* Let users edit later.

---

# 7. Home Dashboard

```text
┌─────────────────────────────┐
│ Today                       │
│ Wed, 28 May                 │
│                             │
│ Calories                    │
│ 1,850 / 2,350 kcal          │
│ ████████░░░                 │
│                             │
│ Protein                     │
│ 92 / 150 g                  │
│ ██████░░░░░                 │
│                             │
│ ┌ AI Insight ────────────┐  │
│ │ Protein is decent, but │  │
│ │ fibre is low today.    │  │
│ └────────────────────────┘  │
│                             │
│ Meals                       │
│ 5:00 PM  Domino’s Pizza     │
│         1,850 kcal          │
│                             │
│        [ + Scan Meal ]      │
│                             │
│ Home  Scan  History Coach   │
└─────────────────────────────┘
```

### Notes

* This screen must be extremely clear.
* Daily timeline prevents yesterday/today confusion.
* Main button should be “+ Scan Meal”.

---

# 8. Scan Meal Screen

```text
┌─────────────────────────────┐
│ Add Meal                    │
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    Upload food photo    │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ Describe your meal          │
│ [ Thin crust BBQ beef pizza │
│   with peri peri sauce... ] │
│                             │
│ How much did you eat?       │
│ [ Whole meal ▼ ]            │
│                             │
│ Meal time                   │
│ [ Today, 5:00 PM ▼ ]        │
│                             │
│        [ Estimate Meal ]    │
└─────────────────────────────┘
```

### Notes

* Photo alone is not enough. The text field is important for accuracy.
* Meal time/date selector is essential.

---

# 9. AI Estimation Loading Screen

```text
┌─────────────────────────────┐
│ Analysing your meal...      │
│                             │
│  ✓ Detecting food items     │
│  ✓ Estimating portion size  │
│  ✓ Calculating macros       │
│                             │
│ This usually takes a few    │
│ seconds.                    │
└─────────────────────────────┘
```

### Notes

* Makes the AI feel professional and transparent.

---

# 10. Meal Result Screen

```text
┌─────────────────────────────┐
│ Meal Estimate               │
│                             │
│ Thin crust BBQ beef pizza   │
│                             │
│ Calories                    │
│ 1,850 kcal                  │
│ Range: 1,600–2,200 kcal     │
│ Confidence: Medium          │
│                             │
│ Protein   85 g              │
│ Carbs     170 g             │
│ Fat       80 g              │
│                             │
│ Why this estimate?          │
│ Cheese, sausage, beef and   │
│ sauces increase calories.   │
│                             │
│ [ Edit ]        [ Save ]    │
└─────────────────────────────┘
```

### Notes

* Range + confidence makes the app more trustworthy.
* Users must be able to edit before saving.

---

# 11. Edit Meal Screen

```text
┌─────────────────────────────┐
│ Edit Meal                   │
│                             │
│ Meal name                   │
│ [ BBQ beef pizza ]          │
│                             │
│ Calories                    │
│ [ 1850 ] kcal               │
│                             │
│ Protein                     │
│ [ 85 ] g                    │
│                             │
│ Carbs                       │
│ [ 170 ] g                   │
│                             │
│ Fat                         │
│ [ 80 ] g                    │
│                             │
│        [ Save Changes ]     │
└─────────────────────────────┘
```

### Notes

* Editing is not optional. Users need control.

---

# 12. History Screen

```text
┌─────────────────────────────┐
│ History                     │
│                             │
│ This Week                   │
│                             │
│ Mon  2,150 kcal             │
│ Tue  2,800 kcal             │
│ Wed  1,850 kcal             │
│ Thu  —                      │
│ Fri  —                      │
│                             │
│ Average                     │
│ 2,266 kcal/day              │
│                             │
│ [ View Calendar ]           │
│                             │
│ Home  Scan  History Coach   │
└─────────────────────────────┘
```

### Notes

* Weekly average is more useful than obsessing over one day.

---

# 13. Coach Screen

```text
┌─────────────────────────────┐
│ AI Coach                    │
│                             │
│ Ask about your food, goals, │
│ training or progress.       │
│                             │
│ Suggested:                  │
│ [ What should I eat next? ] │
│ [ Am I overeating today? ]  │
│ [ How do I hit protein? ]   │
│                             │
│ ┌ Chat ───────────────────┐ │
│ │ You: I’m hungry at night │ │
│ │ AI: Based on today...    │ │
│ └─────────────────────────┘ │
│                             │
│ [ Message...            ]   │
│                             │
│ Home  Scan  History Coach   │
└─────────────────────────────┘
```

### Notes

* Coach should use the user’s logged meals, not generic answers.

---

# 14. Profile Screen

```text
┌─────────────────────────────┐
│ Profile                     │
│                             │
│ Goal                        │
│ Body recomposition          │
│                             │
│ Daily targets               │
│ 2,350 kcal                  │
│ 150 g protein               │
│                             │
│ Preferences                 │
│ Units: kg / cm              │
│ Diet: No restriction        │
│                             │
│ Subscription                │
│ Free Plan                   │
│                             │
│ [ Upgrade to Premium ]      │
│ [ Edit Profile ]            │
└─────────────────────────────┘
```

---

# First MVP Screen Priority

Build in this order:

1. Welcome/Login mock screen
2. Onboarding screens
3. Home Dashboard
4. Scan Meal
5. Meal Result
6. History
7. Coach
8. Profile

---

# Premium UX Rules

1. Never show too much text at once.
2. Make calories and protein instantly visible.
3. Always show which day the food is saved under.
4. Let users edit AI estimates.
5. Show confidence/range instead of pretending exact accuracy.
6. Keep the scan flow under 10 seconds.
7. Make the app useful even without perfect data.
