"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Separator } from "@workspace/ui/components/separator";
import { ActivityIcon, Barbell as DumbbellIcon, Fire as FlameIcon, Trophy as TrophyIcon } from "@phosphor-icons/react";

export function MacroCalculatorTool() {
  const [age, setAge] = React.useState("25");
  const [gender, setGender] = React.useState("male");
  const [weight, setWeight] = React.useState("70");
  const [height, setHeight] = React.useState("175");
  const [activity, setActivity] = React.useState("1.55"); // Moderate
  const [goal, setGoal] = React.useState("maintain"); // lose, maintain, gain

  const [results, setResults] = React.useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  const calculateMacros = () => {
    // Basic validation
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return;

    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (gender === "male") {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // TDEE (Total Daily Energy Expenditure)
    let tdee = bmr * parseFloat(activity);

    // Goal adjustment
    let targetCalories = tdee;
    if (goal === "lose") targetCalories -= 500;
    if (goal === "lose-fast") targetCalories -= 750;
    if (goal === "gain") targetCalories += 300;
    if (goal === "gain-fast") targetCalories += 500;

    // Macro Split
    // A standard balanced split: 30% Protein, 40% Carbs, 30% Fat
    // Protein (4 cal/g), Carbs (4 cal/g), Fat (9 cal/g)
    
    // Adjust macros based on goal
    let proteinPercent = 0.30;
    let fatPercent = 0.30;
    let carbsPercent = 0.40;

    if (goal.includes("lose")) {
      proteinPercent = 0.40; // Higher protein for muscle retention
      fatPercent = 0.30;
      carbsPercent = 0.30;
    } else if (goal.includes("gain")) {
      proteinPercent = 0.25; 
      fatPercent = 0.25;
      carbsPercent = 0.50; // Higher carbs for energy/growth
    }

    const proteinCalories = targetCalories * proteinPercent;
    const fatCalories = targetCalories * fatPercent;
    const carbsCalories = targetCalories * carbsPercent;

    setResults({
      calories: Math.round(targetCalories),
      protein: Math.round(proteinCalories / 4),
      carbs: Math.round(carbsCalories / 4),
      fat: Math.round(fatCalories / 9)
    });
  };

  return (
    <Card className="border border-border/70">
      <CardHeader>
        <CardTitle>Macro Calculator</CardTitle>
        <CardDescription>Calculate your daily calories and macronutrients (protein, carbs, fats) based on your goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={15} max={100} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min={30} max={300} />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} min={100} max={250} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">Sedentary (Little or no exercise)</SelectItem>
                  <SelectItem value="1.375">Lightly active (Exercise 1-3 days/wk)</SelectItem>
                  <SelectItem value="1.55">Moderately active (Exercise 3-5 days/wk)</SelectItem>
                  <SelectItem value="1.725">Very active (Exercise 6-7 days/wk)</SelectItem>
                  <SelectItem value="1.9">Extra active (Very hard exercise/job)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Your Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose-fast">Aggressive Weight Loss</SelectItem>
                  <SelectItem value="lose">Mild Weight Loss</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Mild Weight Gain</SelectItem>
                  <SelectItem value="gain-fast">Aggressive Weight Gain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateMacros} className="w-full">Calculate My Macros</Button>
          </div>

          <div className="bg-muted/30 rounded-2xl p-6 border flex flex-col items-center justify-center min-h-[350px]">
            {results ? (
              <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Daily Target</h3>
                  <div className="flex items-center justify-center text-5xl font-heading font-bold text-primary">
                    <FlameIcon className="h-8 w-8 mr-2 text-orange-500 fill-orange-500" />
                    {results.calories} <span className="text-xl font-normal ml-2 text-muted-foreground">kcal</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  
                  {/* Protein */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900 text-center flex flex-col justify-between">
                    <span className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center justify-center gap-1">
                      <TrophyIcon className="h-4 w-4" /> Protein
                    </span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{results.protein}g</span>
                    <span className="text-xs text-muted-foreground mt-1">{Math.round((results.protein * 4) / results.calories * 100)}%</span>
                  </div>

                  {/* Carbs */}
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl border border-green-100 dark:border-green-900 text-center flex flex-col justify-between">
                    <span className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center justify-center gap-1">
                      <ActivityIcon className="h-4 w-4" /> Carbs
                    </span>
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">{results.carbs}g</span>
                    <span className="text-xs text-muted-foreground mt-1">{Math.round((results.carbs * 4) / results.calories * 100)}%</span>
                  </div>

                  {/* Fat */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-100 dark:border-amber-900 text-center flex flex-col justify-between">
                    <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center justify-center gap-1">
                      <DumbbellIcon className="h-4 w-4" /> Fats
                    </span>
                    <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">{results.fat}g</span>
                    <span className="text-xs text-muted-foreground mt-1">{Math.round((results.fat * 9) / results.calories * 100)}%</span>
                  </div>

                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  This is an estimate based on the Mifflin-St Jeor equation. Adjust based on your actual progress after 2 weeks.
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <FlameIcon className="h-8 w-8" />
                </div>
                <h3 className="font-medium text-muted-foreground">Enter your details and click calculate to see your targets.</h3>
              </div>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
