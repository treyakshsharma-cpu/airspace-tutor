"use client";

import React, { useState } from 'react';
import { UK_CAA_DATA } from '@/data/uk-drone-regulations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

const ComplianceQuiz: React.FC = () => {
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Scenario: Testing the user on PDRA-01 separation distances
  const handleAnswer = (distance: number) => {
    const correctAnswer = UK_CAA_DATA.operational_authorisations.pdra_01.separation_distances.uninvolved_persons_m;
    
    if (distance === correctAnswer) {
      setFeedback({
        isCorrect: true,
        message: `Correct! Under PDRA-01, you must maintain a ${correctAnswer}m horizontal separation from uninvolved persons.`
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `Incorrect. The standard separation required is ${correctAnswer}m to mitigate ground risk.`
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Airspace Scenario ✈️
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-lg font-medium">
          You are planning a roof survey in a built-up area. What is your minimum horizontal separation from uninvolved persons?
        </p>

        <div className="grid grid-cols-1 gap-3">
          {[30, 50, 150].map((dist) => (
            <Button
              key={dist}
              variant="outline"
              className="h-12 text-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
              onClick={() => handleAnswer(dist)}
              disabled={!!feedback}
            >
              {dist} Meters
            </Button>
          ))}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {feedback.isCorrect ? <CheckCircle2 className="mt-1" /> : <XCircle className="mt-1" />}
            <p className="font-medium">{feedback.message}</p>
          </div>
        )}

        {feedback && (
          <Button 
            className="w-full mt-4" 
            onClick={() => setFeedback(null)}
          >
            Next Scenario
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceQuiz;
