import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { states } from '@/data/regions';
import { categories } from '@/data/categories';

type SchemeFormData = {
  title: string;
  description: string;
  category: string;
  state: string;
  eligibility: string[];
  benefits: string[];
  steps: string[];
  documentLink: string;
  deadline?: string;
  isActive: boolean;
};

const CreateSchemePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SchemeFormData>({
    title: '',
    description: '',
    category: '',
    state: 'all',
    eligibility: [''],
    benefits: [''],
    steps: [''],
    documentLink: '',
    isActive: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index: number, field: 'eligibility' | 'benefits' | 'steps', value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: 'eligibility' | 'benefits' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'eligibility' | 'benefits' | 'steps', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray.length > 0 ? newArray : ['']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const cleanFormData = {
        title: formData.title,
        state: formData.state,
        details: formData.description,
        eligibility: formData.eligibility.filter(item => item.trim() !== ''),
        benefits: formData.benefits.filter(item => item.trim() !== ''),
        steps: formData.steps.filter(item => item.trim() !== ''),
        documentLink: formData.documentLink,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        tags: [formData.category],
        isActive: formData.isActive
      };

      const { createScheme } = await import('@/services/schemeService');
      await createScheme(cleanFormData);

      toast({
        title: 'Scheme created successfully',
        description: 'The new scheme has been added to the system.',
      });

      navigate('/schemes');
    } catch (error) {
      console.error('Error creating scheme:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the scheme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-20 lg:pb-0"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">
              Create New Scheme
            </h1>
            <p className="text-muted-foreground">
              Fill in the details below to create a new government scheme
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/schemes')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Scheme Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="title">
                    Scheme Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter scheme title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="category">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="state">
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="all">All India</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="deadline">
                    Application Deadline (Optional)
                  </label>
                  <div className="relative">
                    <Input
                      id="deadline"
                      name="deadline"
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="description">
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description of the scheme"
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Eligibility Criteria</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addArrayItem('eligibility')}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Criteria
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.eligibility.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'eligibility', e.target.value)}
                        placeholder={`Eligibility criteria ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.eligibility.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('eligibility', index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Benefits</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addArrayItem('benefits')}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Benefit
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.benefits.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'benefits', e.target.value)}
                        placeholder={`Benefit ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.benefits.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Application Steps</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addArrayItem('steps')}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Step
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.steps.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {index + 1}
                      </div>
                      <Input
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'steps', e.target.value)}
                        placeholder={`Step ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.steps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeArrayItem('steps', index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="documentLink">
                  Document Link *
                </label>
                <Input
                  id="documentLink"
                  name="documentLink"
                  value={formData.documentLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/scheme-details.pdf"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Make this scheme active and visible to users
                </label>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Scheme...' : 'Create Scheme'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </AppLayout>
  );
};

export default CreateSchemePage;
