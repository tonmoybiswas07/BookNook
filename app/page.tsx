import Banner from "./Components/Home/Banner/Banner";
import HowBorrowingWorks from "./Components/Home/HowBorrowingWorks/HowBorrowingWorks";
import NewArrivals from "./Components/Home/newArrivals/newArrivals";
import ReaderReviews from "./Components/Home/ReaderReviews/ReaderReviews";
import TopCategories from "./Components/Home/TopCategories/TopCategories";


export default function Home() {
  return (
   <div>
<Banner/>
<NewArrivals/>
<TopCategories/>
<HowBorrowingWorks/>
<ReaderReviews/>
   </div>
  );
}
