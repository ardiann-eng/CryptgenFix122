import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";
import { insertTransactionSchema } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Extend the transaction schema with validation
const formSchema = insertTransactionSchema.extend({
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm = () => {
  const { toast } = useToast();
  const createTransaction = useCreateTransaction();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      type: "income",
      category: "dues",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createTransaction.mutateAsync({
        ...data,
        date: new Date(data.date),
      });
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      
      // Reset form
      form.reset({
        description: "",
        amount: 0,
        date: format(new Date(), "yyyy-MM-dd"),
        type: "income",
        category: "dues",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 font-sans mb-4">Add Transaction</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="transaction-type" className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </Label>
            <Select
              onValueChange={(value) => form.setValue("type", value as "income" | "expense")}
              defaultValue={form.getValues("type")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="transaction-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Rp)
            </Label>
            <Input
              id="transaction-amount"
              type="number"
              placeholder="0"
              {...form.register("amount")}
            />
            {form.formState.errors.amount && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.amount.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="transaction-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </Label>
            <Select
              onValueChange={(value) => 
                form.setValue("category", value as "dues" | "donation" | "event" | "supplies" | "study" | "other")
              }
              defaultValue={form.getValues("category")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dues">Class Dues</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="study">Study Materials</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="transaction-date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </Label>
            <Input
              id="transaction-date"
              type="date"
              {...form.register("date")}
            />
            {form.formState.errors.date && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.date.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="transaction-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </Label>
            <Textarea
              id="transaction-description"
              rows={2}
              placeholder="Enter description..."
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={createTransaction.isPending}
          >
            {createTransaction.isPending ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
