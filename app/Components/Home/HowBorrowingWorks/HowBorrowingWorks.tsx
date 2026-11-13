import { Search, CheckCircle, Clock } from "lucide-react";

export default function HowBorrowingWorks() {
  const steps = [
    {
      step: "01",
      title: "Explore & Discover",
      description: "Browse through our extensive library of books across multiple categories and find your next great read.",
      icon: Search,
    },
    {
      step: "02",
      title: "Borrow Instantly",
      description: "Logged-in users can click 'Borrow This Book' on any book details page with just a single click.",
      icon: CheckCircle,
    },
    {
      step: "03",
      title: "Read & Return",
      description: "Enjoy your book for a few days, keep track of your active borrows, and return it effortlessly when done.",
      icon: Clock,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/50 rounded-3xl my-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
          Simple Process
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-3">
          How Borrowing Works
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Getting your hands on your favorite books has never been easier. Follow these 3 simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute top-6 right-6 text-4xl font-extrabold text-gray-100 group-hover:text-indigo-50 transition-colors">
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}