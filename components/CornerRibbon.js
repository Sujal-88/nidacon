import { Ticket } from 'lucide-react'; // Using a ticket icon for registration

const CornerRibbon = () => {
  return (
    // The link makes the entire ribbon clickable
    <a 
      href="  /register-now" 
      className="
        fixed top-8 right-[-60px] z-50 /* Positioning */
        w-48 /* Width of the ribbon */
        transform rotate-45 /* The 45-degree rotation */
        bg-red-600 text-white text-center font-semibold /* Styling */
        py-2 shadow-xl /* More styling */
        hover:bg-red-700 transition-all duration-300 /* Hover effect */
      "
    >
      <div className="flex items-center justify-center">
        <Ticket className="mr-2 h-5 w-5" />
        Register Now!
      </div>
    </a>
  );
};

export default CornerRibbon;