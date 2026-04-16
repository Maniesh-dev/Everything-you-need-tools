"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const scale: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
};

export function GpaCalculatorTool() {
  const [courses, setCourses] = React.useState<Course[]>([
    { id: "1", name: "Math", grade: "A", credits: 3 },
    { id: "2", name: "Science", grade: "B+", credits: 4 },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: crypto.randomUUID(), name: "", grade: "A", credits: 3 }]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };
  
  const updateCourse = (id: string, field: keyof Course, val: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const calc = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(c => {
      const gpaValue = scale[c.grade];
      if (c.credits > 0 && gpaValue !== undefined) {
        totalPoints += gpaValue * c.credits;
        totalCredits += c.credits;
      }
    });

    return totalCredits === 0 ? 0 : totalPoints / totalCredits;
  };

  const gpa = calc();

  return (
    <Card className="border border-border/70">
      <CardHeader><CardTitle>GPA Calculator</CardTitle><CardDescription>Calculate your semester or cumulative Grade Point Average.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <div className="flex gap-2 font-semibold text-xs tracking-wider uppercase text-muted-foreground ml-1">
             <div className="flex-[2]">Course Name</div>
             <div className="flex-1">Grade</div>
             <div className="flex-1">Credits</div>
             <div className="w-8"></div>
          </div>
          
          {courses.map((c) => (
            <div key={c.id} className="flex gap-2 items-center">
              <Input className="flex-[2]" placeholder="e.g. Physics 101" value={c.name} onChange={e => updateCourse(c.id, "name", e.target.value)} />
              <select className="flex-1 h-10 px-3 rounded-md border border-input bg-background" value={c.grade} onChange={e => updateCourse(c.id, "grade", e.target.value)}>
                {Object.keys(scale).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <Input type="number" min="0" className="flex-1" value={c.credits} onChange={e => updateCourse(c.id, "credits", parseFloat(e.target.value) || 0)} />
              <Button variant="ghost" size="icon" className="w-8 h-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeCourse(c.id)}>&times;</Button>
            </div>
          ))}
          
          <Button variant="outline" onClick={addCourse} className="w-full border-dashed">Add Course</Button>
        </div>

        <div className="pt-6 border-t mt-4 flex items-center justify-between bg-primary/5 p-6 rounded-2xl border border-primary/20">
          <div>
            <p className="text-sm tracking-wider uppercase font-semibold text-primary">Your GPA</p>
            <p className="text-xs text-muted-foreground mt-1">Based on standard 4.0 scale</p>
          </div>
          <div className="text-5xl font-bold tabular-nums text-primary">{gpa.toFixed(2)}</div>
        </div>

      </CardContent>
    </Card>
  );
}
