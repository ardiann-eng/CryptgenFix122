import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';

const Contact = () => {
  return (
    <div className="animate-fade-in">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Contact Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ContactForm />
          </div>
          
          <div>
            <ContactInfo />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
