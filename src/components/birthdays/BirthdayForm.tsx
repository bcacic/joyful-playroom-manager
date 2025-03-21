import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Birthday, BirthdayBoy } from '@/types';
import { toast } from 'sonner';

// Mock data for birthday boys
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

interface BirthdayFormProps {
  birthday?: Birthday;
  isEdit?: boolean;
}

const BirthdayForm = ({ birthday, isEdit = false }: BirthdayFormProps) => {
  const navigate = useNavigate();
  const [birthdayBoys] = useState<BirthdayBoy[]>(mockBirthdayBoys);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Birthday>>(
    birthday || {
      birthdayBoyId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '13:00',
      endTime: '16:00',
      packageType: 'standard',
      guestCount: 10,
      status: 'upcoming',
      price: 200,
      deposit: 50,
      depositPaid: false,
      notes: '',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log('Form data to submit:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEdit ? 'Birthday updated successfully!' : 'Birthday created successfully!');
      navigate('/birthdays');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof Birthday,
    value: string | number | boolean
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleChange('date', format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Birthday Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthdayBoyId">Birthday Boy</Label>
                  <Select
                    value={formData.birthdayBoyId}
                    onValueChange={(value) => handleChange('birthdayBoyId', value)}
                  >
                    <SelectTrigger id="birthdayBoyId">
                      <SelectValue placeholder="Select a birthday boy" />
                    </SelectTrigger>
                    <SelectContent>
                      {birthdayBoys.map((boy) => (
                        <SelectItem key={boy.id} value={boy.id}>
                          {boy.name} ({boy.age} years)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date
                          ? format(new Date(formData.date), 'PPP')
                          : 'Select a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date ? new Date(formData.date) : undefined}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      type="time"
                      id="startTime"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      type="time"
                      id="endTime"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Input
                    type="number"
                    id="guestCount"
                    min={1}
                    max={30}
                    value={formData.guestCount}
                    onChange={(e) => handleChange('guestCount', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'upcoming' | 'completed' | 'cancelled') => 
                      handleChange('status', value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or notes..."
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Package & Payment</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Package Type</Label>
                <RadioGroup
                  value={formData.packageType}
                  onValueChange={(value: 'basic' | 'standard' | 'premium') => 
                    handleChange('packageType', value)
                  }
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="basic" id="basic" />
                    <Label htmlFor="basic" className="flex-1 cursor-pointer">
                      <div>Basic</div>
                      <div className="text-sm text-muted-foreground">$150 - Up to 10 guests</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div>Standard</div>
                      <div className="text-sm text-muted-foreground">$200 - Up to 15 guests</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="flex-1 cursor-pointer">
                      <div>Premium</div>
                      <div className="text-sm text-muted-foreground">$300 - Up to 20 guests</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit ($)</Label>
                  <Input
                    type="number"
                    id="deposit"
                    value={formData.deposit}
                    onChange={(e) => handleChange('deposit', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="depositPaid"
                    checked={formData.depositPaid}
                    onCheckedChange={(checked) => 
                      handleChange('depositPaid', checked === true)
                    }
                  />
                  <label
                    htmlFor="depositPaid"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Deposit has been paid
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Birthday' : 'Create Birthday'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/birthdays')}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BirthdayForm;
