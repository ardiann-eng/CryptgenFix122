import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { useSendContactMessage } from "@/hooks/useContact";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react";

// Extend contact form schema for validation
const formSchema = insertContactMessageSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long")
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const { toast } = useToast();
  const sendContactMessage = useSendContactMessage();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await sendContactMessage.mutateAsync(data);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. We will get back to you soon.",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 font-sans sm:text-4xl">Contact Us</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Get in touch with the CryptGen class representatives for any inquiries or feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Contact Form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 font-sans mb-6">Send a Message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Message subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your message" 
                          rows={5} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Contact Information */}
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 font-sans mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/20 rounded-full">
                    <MapPin className="text-primary h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Computer Science Building, Room 201<br />
                      University Campus, Jakarta 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/20 rounded-full">
                    <Mail className="text-primary h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 mt-1">cryptgen.class@example.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/20 rounded-full">
                    <Phone className="text-primary h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600 mt-1">
                      +62 812 3456 7890 (Class President)<br />
                      +62 898 7654 3210 (Secretary)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-3 bg-primary/20 rounded-full">
                    <Clock className="text-primary h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Office Hours</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Monday - Friday: 10:00 AM - 4:00 PM<br />
                      Saturday: 10:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Social Media */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 font-sans mb-6">Connect With Us</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="bg-[#4267B2] text-white hover:bg-[#4267B2]/90 border-none">
                  <Facebook className="h-4 w-4 mr-2" />
                  <span>Facebook</span>
                </Button>
                <Button variant="outline" className="bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90 border-none">
                  <Twitter className="h-4 w-4 mr-2" />
                  <span>Twitter</span>
                </Button>
                <Button variant="outline" className="bg-[#E4405F] text-white hover:bg-[#E4405F]/90 border-none">
                  <Instagram className="h-4 w-4 mr-2" />
                  <span>Instagram</span>
                </Button>
                <Button variant="outline" className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90 border-none">
                  <Linkedin className="h-4 w-4 mr-2" />
                  <span>LinkedIn</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Map Section */}
      <Card className="mb-10">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 font-sans mb-6">Location</h3>
          <div className="h-80 bg-gray-200 rounded-md flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Interactive Map</p>
              <p className="text-xs text-gray-400 mt-2">Map would be integrated here</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* FAQ Section */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-gray-900 font-sans text-center mb-8">Frequently Asked Questions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-2">How do I join class activities?</h4>
              <p className="text-gray-600">
                All class members are automatically included in activities. Special events may require separate registration which will be announced in advance.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-2">How can I contribute to the class fund?</h4>
              <p className="text-gray-600">
                You can pay your monthly dues to the treasurer. Details about payment methods and due dates can be found in the Financial Dashboard section.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-2">How can I propose a class event?</h4>
              <p className="text-gray-600">
                Submit your proposal to the class president or secretary using the contact form on this page or during weekly class meetings.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-2">Where can I find study materials?</h4>
              <p className="text-gray-600">
                Study materials are shared through our class cloud storage. Access details are provided in the Announcements section.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
