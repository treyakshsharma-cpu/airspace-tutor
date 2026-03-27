"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { validateFlightPlan, FlightPlan } from '@/utils/flight-validator';
import { Plane, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const FlightSandbox: React.FC = () => {
  const [plan, setPlan] = useState<FlightPlan>({
    altitude: 30,
    distanceFromUninvolved: 100,
    isOverAssembly: false,
    isDroppingArticles: false,
    isInFRZ: false,
    hasATCPermission: false,
  });

  const validation = useMemo(() => validateFlightPlan(plan), [plan]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-2">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-blue-600" />
          Mission Planner Simulator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-8">
        {/* Validation Alert */}
        <Alert variant={validation.isLegal ? "default" : "destructive"} 
               className={validation.isLegal ? "border-green-500 bg-green-50" : ""}>
          {validation.isLegal ? <CheckCircle className="text-green-600" /> : <AlertTriangle />}
          <AlertTitle className="font-bold">
            {validation.isLegal ? "MISSION STATUS: GO" : "MISSION STATUS: NO-GO"}
          </AlertTitle>
          <AlertDescription>
            {validation.isLegal 
              ? "Your flight parameters are within PDRA-01 limitations." 
              : validation.errors.map((err, i) => <div key={i}>• {err}</div>)}
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* Altitude Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="font-bold">Altitude: {plan.altitude}m</Label>
              <span className="text-xs text-muted-foreground">Max: 120m</span>
            </div>
            <Slider 
              value={[plan.altitude]} 
              max={150} 
              step={1} 
              onValueChange={([v]) => setPlan({...plan, altitude: v})} 
            />
          </div>

          {/* Distance Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="font-bold">Distance from People: {plan.distanceFromUninvolved}m</Label>
              <span className="text-xs text-muted-foreground">Min: 50m</span>
            </div>
            <Slider 
              value={[plan.distanceFromUninvolved]} 
              max={200} 
              step={1} 
              onValueChange={([v]) => setPlan({...plan, distanceFromUninvolved: v})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="assembly" className="flex items-center gap-2 cursor-pointer">
                <Users className="w-4 h-4" /> Flying over crowds?
              </Label>
              <Switch 
                id="assembly" 
                checked={plan.isOverAssembly} 
                onCheckedChange={(v) => setPlan({...plan, isOverAssembly: v})} 
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="dropping" className="cursor-pointer">Dropping payload?</Label>
              <Switch 
                id="dropping" 
                checked={plan.isDroppingArticles} 
                onCheckedChange={(v) => setPlan({...plan, isDroppingArticles: v})} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightSandbox;
