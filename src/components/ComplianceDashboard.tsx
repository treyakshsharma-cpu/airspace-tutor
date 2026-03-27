"use client";

import React from 'react';
import { UK_CAA_DATA } from '@/data/uk-drone-regulations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Lock, ArrowRight } from 'lucide-react';

interface UserStatus {
  hasFlyerId: boolean;
  hasOperatorId: boolean;
  hasRpcL1: boolean;
  hasPdra01: boolean;
  hasInsurance: boolean;
}

interface Step {
  id: string;
  label: string;
  done: boolean;
  cost: string;
}

const ComplianceDashboard: React.FC = () => {
  // Logic: In a real app, these would come from a User's profile/DB
  const userStatus = {
    hasFlyerId: true,
    hasOperatorId: true,
    hasRpcL1: false,
    hasPdra01: false,
    hasInsurance: false,
  };

  const steps = [
    { id: 'flyer', label: 'Individual Flyer ID', done: userStatus.hasFlyerId, cost: "£0" },
    { id: 'operator', label: 'Company Operator ID', done: userStatus.hasOperatorId, cost: "£11.79" },
    { id: 'rpc', label: 'RPC-L1 Certification', done: userStatus.hasRpcL1, cost: "~£600" },
    { id: 'insurance', label: 'EC 785/2004 Insurance', done: userStatus.hasInsurance, cost: "Varies" },
    { id: 'pdra', label: 'PDRA-01 Authorisation', done: userStatus.hasPdra01, cost: "£500" },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progressValue = (completedCount / steps.length) * 100;

  return (
    <Card className="w-full max-w-2xl border-blue-100 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">Road to Compliance</CardTitle>
            <CardDescription>Phase 1: Operational Readiness</CardDescription>
          </div>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
            {completedCount}/{steps.length} Steps
          </span>
        </div>
        <Progress value={progressValue} className="h-2 mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              step.done ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'
            }`}
          >
            <div className="flex items-center gap-4">
              {step.done ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-slate-300" />
              )}
              <div>
                <p className={`font-semibold ${step.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-500">Initial Cost: {step.cost}</p>
              </div>
            </div>
            
            {!step.done && (
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                Start <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        <div className="mt-6 p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-slate-400" />
            <div>
              <p className="font-bold text-sm">Phase 2: Org Independence</p>
              <p className="text-xs text-slate-400">Unlock after completing Phase 1 </p>
            </div>
          </div>
          <div className="h-8 w-8 rounded-full border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
            2
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceDashboard;
