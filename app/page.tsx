import Banner from "./Components/Home/Banner/Banner";
import HowBorrowingWorks from "./Components/Home/HowBorrowingWorks/HowBorrowingWorks";
import ReaderReviews from "./Components/Home/ReaderReviews/ReaderReviews";
import TopCategories from "./Components/Home/TopCategories/TopCategories";


export default function Home() {
  return (
   <div>
<Banner/>
<TopCategories/>
<HowBorrowingWorks/>
<ReaderReviews/>
   </div>
  );
}
