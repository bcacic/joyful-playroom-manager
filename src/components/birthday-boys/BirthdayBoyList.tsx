
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, User, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Card from '@/components/ui/Card';
import { BirthdayBoy } from '@/types';

// Mock data for initial rendering
const mockBirthdayBoys: BirthdayBoy[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    age: 7,
    parentName: 'Sarah Johnson',
    parentPhone: '555-123-4567',
    createdAt: '2023-10-15T10:00:00Z',
    updatedAt: '2023-10-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Emily Smith',
    age: 6,
    parentName: 'John Smith',
    parentPhone: '555-987-6543',
    createdAt: '2023-10-18T10:00:00Z',
    updatedAt: '2023-10-18T10:00:00Z',
  },
  {
    id: '3',
    name: 'Michael Brown',
    age: 8,
    parentName: 'Jessica Brown',
    parentPhone: '555-456-7890',
    notes: 'Allergic to nuts',
    createdAt: '2023-10-20T10:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z',
  },
];

const BirthdayBoyList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [birthdayBoys, setBirthdayBoys] = useState<BirthdayBoy[]>(mockBirthdayBoys);

  // In a real app, you would fetch this data from an API
  // and implement proper search functionality

  const filteredBirthdayBoys = birthdayBoys.filter(boy =>
    boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boy.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boy.parentPhone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search birthday boys..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link to="/birthday-boys/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Birthday Boy
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBirthdayBoys.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No birthday boys found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add a new birthday boy to get started.
              </p>
              <Button asChild className="mt-4">
                <Link to="/birthday-boys/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Birthday Boy
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          filteredBirthdayBoys.map((boy) => (
            <Link key={boy.id} to={`/birthday-boys/${boy.id}`}>
              <Card hoverable className="h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 rounded-full p-3 mr-3">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{boy.name}</h3>
                      <p className="text-sm text-muted-foreground">{boy.age} years old</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Parent: </span>
                    <span className="ml-1">{boy.parentName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone: </span>
                    <span className="ml-1">{boy.parentPhone}</span>
                  </div>
                </div>
                {boy.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Notes: </span>
                      {boy.notes}
                    </p>
                  </div>
                )}
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BirthdayBoyList;
