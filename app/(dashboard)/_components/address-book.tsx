import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/clerk-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Id } from '@/convex/_generated/dataModel';
import { Book, Plus, ArrowLeft } from 'lucide-react';
import { Hint } from '@/components/hint';

interface Customer {
  _id: Id<'customers'>;
  name: string;
  phoneNumber: string;
  address: string;
  lastOrderId?: Id<'tasks'>;
}

interface FormData {
  name: string;
  phoneNumber: string;
  address: string;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const AddressBook: React.FC = () => {
  const { organization } = useOrganization();
  const customers = useQuery(api.customer.get, { orgId: organization?.id ?? '' });
  const createCustomer = useMutation(api.customer.create);
  const updateCustomer = useMutation(api.customer.update);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    address: '',
  });
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const sortedCustomers = useMemo(() => {
    return customers?.sort((a, b) => a.name.localeCompare(b.name)) || [];
  }, [customers]);

  const groupedCustomers = useMemo(() => {
    return sortedCustomers.reduce((acc, customer) => {
      const firstLetter = customer.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(customer);
      return acc;
    }, {} as Record<string, Customer[]>);
  }, [sortedCustomers]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization) return;

    try {
      if (selectedCustomer) {
        await updateCustomer({
          id: selectedCustomer._id,
          ...formData,
        });
        toast.success('Customer updated successfully');
      } else {
        await createCustomer({
          orgId: organization.id,
          ...formData,
        });
        toast.success('Customer added successfully');
      }
      setFormData({ name: '', phoneNumber: '', address: '' });
      setSelectedCustomer(null);
      setIsAddingNew(false);
    } catch (error) {
      toast.error('Failed to save customer');
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
    });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setFormData({ name: '', phoneNumber: '', address: '' });
    setIsAddingNew(true);
  };

  const handleBack = () => {
    setSelectedCustomer(null);
    setIsAddingNew(false);
    setSelectedLetter(null);
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Book className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
        <DialogHeader>
          <DialogTitle>Address Book</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4 bg-white dark:bg-gray-800">
          {!isAddingNew && !selectedCustomer && (
            <div className="w-full flex">
              <div className="flex-grow pr-4">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    Customer List
                  </h3>
                  <Button
                    onClick={handleAddNew}
                    size="sm"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New
                  </Button>
                </div>
                <div className="h-[400px] overflow-y-auto pr-2">
                  {Object.entries(groupedCustomers).map(([letter, customers]) =>
                    selectedLetter === null || selectedLetter === letter ? (
                      <div key={letter} id={letter} className="mb-4">
                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                          {letter}
                        </h4>
                        <Hint
                          label="✏️ Edit Contact Information"
                          side="left"
                          align="center"
                          sideOffset={10}
                        >
                          <div className="space-y-2">
                            {customers.map((customer) => (
                              <div
                                key={customer._id}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded text-gray-800 dark:text-gray-100"
                                onClick={() => handleCustomerSelect(customer)}
                              >
                                {customer.name}
                              </div>
                            ))}
                          </div>
                        </Hint>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
              <div className="w-8 flex flex-col">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    className={`flex-1 text-xs font-semibold ${
                      selectedLetter === letter
                        ? 'bg-gray-300 dark:bg-gray-600'
                        : ''
                    } hover:bg-gray-200 dark:hover:bg-gray-500`}
                    onClick={() => handleLetterSelect(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          )}
          {(isAddingNew || selectedCustomer) && (
            <div className="w-full">
              <div className="flex items-center mb-4">
                <Button
                  onClick={handleBack}
                  variant="ghost"
                  size="sm"
                  className="mr-2 bg-gray-100 dark:bg-gray-700 text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                  {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-100 dark:bg-gray-700 border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-100 dark:bg-gray-700 border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-100 dark:bg-gray-700 border-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {selectedCustomer ? 'Update Customer' : 'Add Customer'}
                </Button>
              </form>
              {selectedCustomer && selectedCustomer.lastOrderId && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Last Order</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Order ID: {selectedCustomer.lastOrderId}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressBook;
