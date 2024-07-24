import React, { useState } from 'react';
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
import { Book } from 'lucide-react';

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

export const AddressBook: React.FC = () => {
  const { organization } = useOrganization();
  const customers = useQuery(api.customer.get, { orgId: organization?.id ?? '' });
  const createCustomer = useMutation(api.customer.create);
  const updateCustomer = useMutation(api.customer.update);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Book className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-amber-400 dark:bg-amber-600">
        <DialogHeader>
          <DialogTitle>Address Book</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4 bg-amber-400 dark:bg-amber-600">
          <div className="w-1/3">
            <h3 className="mb-2 font-semibold">Customer List</h3>
            <div className="space-y-2">
              {customers?.map((customer) => (
                <div
                  key={customer._id}
                  className="p-2 hover:bg-amber-100 cursor-pointer rounded"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  {customer.name}
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3">
            <h3 className="mb-2 font-semibold">{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className='bg-amber-200 dark:bg-amber-500'
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
                  className='bg-amber-200 dark:bg-amber-500'
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
                  className='bg-amber-200 dark:bg-amber-500'
                />
              </div>
              <Button type="submit">
                {selectedCustomer ? 'Update Customer' : 'Add Customer'}
              </Button>
            </form>
            {selectedCustomer && selectedCustomer.lastOrderId && (
              <div className="mt-4">
                <h3 className="font-semibold">Last Order</h3>
                <p>Order ID: {selectedCustomer.lastOrderId}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressBook;