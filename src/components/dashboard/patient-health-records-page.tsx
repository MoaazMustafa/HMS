'use client';

import { format } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  Heart,
  Pill,
  Shield,
  Syringe,
  Thermometer,
  TrendingUp,
  Weight,
  Wind,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VitalSign {
  id: string;
  systolicBP: number | null;
  diastolicBP: number | null;
  heartRate: number | null;
  temperature: number | null;
  weight: number | null;
  height: number | null;
  oxygenSaturation: number | null;
  respiratoryRate: number | null;
  bmi: number | null;
  status: string;
  notes: string | null;
  recordedAt: Date;
}

interface Allergy {
  id: string;
  allergen: string;
  type: string;
  severity: string;
  reaction: string | null;
  diagnosedAt: Date | null;
  notes: string | null;
}

interface Immunization {
  id: string;
  vaccineName: string;
  dateAdministered: Date;
  doseNumber: number | null;
  manufacturer: string | null;
  lotNumber: string | null;
  expirationDate: Date | null;
  administeredBy: string | null;
  site: string | null;
  nextDueDate: Date | null;
  notes: string | null;
}

interface PatientHealthRecordsPageProps {
  vitalSigns: VitalSign[];
  allergies: Allergy[];
  immunizations: Immunization[];
}

export default function PatientHealthRecordsPage({
  vitalSigns,
  allergies,
  immunizations,
}: PatientHealthRecordsPageProps) {
  const [activeTab, setActiveTab] = useState('vital-signs');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'ABNORMAL':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'MILD':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'MODERATE':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'SEVERE':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getAllergyTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'MEDICATION':
        return <Pill className="h-4 w-4" />;
      case 'FOOD':
        return <AlertTriangle className="h-4 w-4" />;
      case 'ENVIRONMENTAL':
        return <Wind className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Records</h1>
        <p className="text-muted-foreground">
          View your vital signs, allergies, and immunization history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/10 p-3">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Vital Signs</p>
              <p className="text-2xl font-bold">{vitalSigns.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/10 p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Allergies</p>
              <p className="text-2xl font-bold">{allergies.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500/10 p-3">
              <Syringe className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Immunizations</p>
              <p className="text-2xl font-bold">{immunizations.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vital-signs" className="gap-2">
            <Activity className="h-4 w-4" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="allergies" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Allergies
          </TabsTrigger>
          <TabsTrigger value="immunizations" className="gap-2">
            <Syringe className="h-4 w-4" />
            Immunizations
          </TabsTrigger>
        </TabsList>

        {/* Vital Signs Tab */}
        <TabsContent value="vital-signs" className="mt-6 space-y-4">
          {vitalSigns.length === 0 ? (
            <Card className="p-12 text-center">
              <Activity className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
              <h3 className="mb-2 text-lg font-semibold">
                No Vital Signs Recorded
              </h3>
              <p className="text-muted-foreground">
                Your vital signs will appear here once they are recorded by your
                healthcare provider.
              </p>
            </Card>
          ) : (
            vitalSigns.map((vital) => (
              <Card key={vital.id} className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`gap-1 ${getStatusColor(vital.status)}`}
                    >
                      <Shield className="h-3 w-3" />
                      {vital.status}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {format(
                        new Date(vital.recordedAt),
                        'MMMM dd, yyyy • HH:mm',
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {vital.systolicBP && vital.diastolicBP && (
                    <div className="bg-accent/50 flex items-center gap-3 rounded-lg p-3">
                      <Heart className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Blood Pressure
                        </div>
                        <div className="text-lg font-semibold">
                          {vital.systolicBP}/{vital.diastolicBP}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          mmHg
                        </div>
                      </div>
                    </div>
                  )}
                  {vital.heartRate && (
                    <div className="bg-accent/50 flex items-center gap-3 rounded-lg p-3">
                      <Activity className="h-5 w-5 text-pink-500" />
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Heart Rate
                        </div>
                        <div className="text-lg font-semibold">
                          {vital.heartRate}
                        </div>
                        <div className="text-muted-foreground text-xs">bpm</div>
                      </div>
                    </div>
                  )}
                  {vital.temperature && (
                    <div className="bg-accent/50 flex items-center gap-3 rounded-lg p-3">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Temperature
                        </div>
                        <div className="text-lg font-semibold">
                          {vital.temperature}
                        </div>
                        <div className="text-muted-foreground text-xs">°C</div>
                      </div>
                    </div>
                  )}
                  {vital.weight && (
                    <div className="bg-accent/50 flex items-center gap-3 rounded-lg p-3">
                      <Weight className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Weight
                        </div>
                        <div className="text-lg font-semibold">
                          {vital.weight}
                        </div>
                        <div className="text-muted-foreground text-xs">kg</div>
                      </div>
                    </div>
                  )}
                  {vital.oxygenSaturation && (
                    <div className="bg-accent/50 flex items-center gap-3 rounded-lg p-3">
                      <Wind className="h-5 w-5 text-cyan-500" />
                      <div>
                        <div className="text-muted-foreground text-xs">
                          Oxygen Saturation
                        </div>
                        <div className="text-lg font-semibold">
                          {vital.oxygenSaturation}
                        </div>
                        <div className="text-muted-foreground text-xs">%</div>
                      </div>
                    </div>
                  )}
                  {vital.bmi && (
                    <div className="bg-accent/50 flex items-center gap-3 rounded-lg p-3">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <div>
                        <div className="text-muted-foreground text-xs">BMI</div>
                        <div className="text-lg font-semibold">
                          {vital.bmi.toFixed(1)}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          kg/m²
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {vital.notes && (
                  <div className="mt-4 border-t pt-4">
                    <p className="mb-1 text-sm font-medium">Notes</p>
                    <p className="text-muted-foreground text-sm">
                      {vital.notes}
                    </p>
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {/* Allergies Tab */}
        <TabsContent value="allergies" className="mt-6 space-y-4">
          {allergies.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
              <h3 className="mb-2 text-lg font-semibold">
                No Allergies Recorded
              </h3>
              <p className="text-muted-foreground">
                Your allergy information will appear here once recorded by your
                healthcare provider.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {allergies.map((allergy) => (
                <Card key={allergy.id} className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getAllergyTypeIcon(allergy.type)}
                      <h3 className="font-semibold">{allergy.allergen}</h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getSeverityColor(allergy.severity)}`}
                    >
                      {allergy.severity}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{allergy.type}</span>
                    </div>
                    {allergy.reaction && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reaction:</span>
                        <span className="font-medium">{allergy.reaction}</span>
                      </div>
                    )}
                    {allergy.diagnosedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Diagnosed:
                        </span>
                        <span className="font-medium">
                          {format(
                            new Date(allergy.diagnosedAt),
                            'MMM dd, yyyy',
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {allergy.notes && (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-muted-foreground text-xs">
                        {allergy.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Immunizations Tab */}
        <TabsContent value="immunizations" className="mt-6 space-y-4">
          {immunizations.length === 0 ? (
            <Card className="p-12 text-center">
              <Syringe className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
              <h3 className="mb-2 text-lg font-semibold">
                No Immunizations Recorded
              </h3>
              <p className="text-muted-foreground">
                Your immunization records will appear here once recorded by your
                healthcare provider.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {immunizations.map((immunization) => (
                <Card key={immunization.id} className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-500/10 p-2">
                        <div>
                          <h3 className="font-semibold">
                            {immunization.vaccineName}
                          </h3>
                          {immunization.doseNumber && (
                            <p className="text-muted-foreground text-xs">
                              Dose: {immunization.doseNumber}
                            </p>
                          )}
                        </div>
                        )
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-green-500/20 bg-green-500/10 text-green-500"
                    >
                      Completed
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Administered
                      </p>
                      <p className="font-medium">
                        {format(
                          new Date(immunization.dateAdministered),
                          'MMM dd, yyyy',
                        )}
                      </p>
                    </div>
                    {immunization.administeredBy && (
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Administered By
                        </p>
                        <p className="font-medium">
                          {immunization.administeredBy}
                        </p>
                      </div>
                    )}
                    {immunization.manufacturer && (
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Manufacturer
                        </p>
                        <p className="font-medium">
                          {immunization.manufacturer}
                        </p>
                      </div>
                    )}
                    {immunization.lotNumber && (
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Lot Number
                        </p>
                        <p className="font-medium">{immunization.lotNumber}</p>
                      </div>
                    )}
                  </div>

                  {immunization.nextDueDate && (
                    <div className="mt-3 flex items-center gap-2 border-t pt-3 text-sm">
                      <Badge
                        variant="outline"
                        className="border-blue-500/20 bg-blue-500/10 text-blue-500"
                      >
                        Next Due:{' '}
                        {format(
                          new Date(immunization.nextDueDate),
                          'MMM dd, yyyy',
                        )}
                      </Badge>
                    </div>
                  )}

                  {immunization.notes && (
                    <div className="mt-3 border-t pt-3">
                      <p className="text-muted-foreground text-xs">
                        {immunization.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
