import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all the fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Mock submission (in a real app, this would be an API call)
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Send a Message</h3>
        <p className="text-gray-600 mt-1">Have a question or feedback? Reach out to us.</p>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input 
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter message subject"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea 
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Type your message here..."
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <div>
            <button 
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
