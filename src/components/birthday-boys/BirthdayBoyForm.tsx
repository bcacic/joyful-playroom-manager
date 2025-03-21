
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Card from '@/components/ui/Card';
import { BirthdayBoy } from '@/types';
import { toast } from '@/components/ui/sonner';

interface BirthdayBoyFormProps {
  birthdayBoy?: BirthdayBoy;
  isEdit?: boolean;
}

const BirthdayBoyForm = ({ birthdayBoy, isEdit = false }: BirthdayBoyFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<BirthdayBoy>>(
    birthdayBoy || {
      name: '',
      age: 0,
      parentName: '',
      parentPhone: '',
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
      
      toast.success(isEdit ? 'Birthday boy updated successfully!' : 'Birthday boy created successfully!');
      navigate('/birthday-boys');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof BirthdayBoy,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Child's Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter child's name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                min={1}
                max={15}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => handleChange('parentName', e.target.value)}
                placeholder="Enter parent's name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
              <Input
                id="parentPhone"
                value={formData.parentPhone}
                onChange={(e) => handleChange('parentPhone', e.target.value)}
                placeholder="Enter parent's phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any special requirements, allergies, or notes..."
                rows={4}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col md:flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/birthday-boys')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Birthday Boy' : 'Add Birthday Boy'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BirthdayBoyForm;
