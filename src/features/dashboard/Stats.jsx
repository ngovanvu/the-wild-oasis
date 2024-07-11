import { HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineChartBar } from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  //1 số lượng đặt phòng
  const numBookings = bookings.length;
  //2. Tổng tiền
  const sales = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  //3. Check-in
  const checkins = confirmedStays.length;
  //4. Tỷ suất số đêm khách ở
  //num checked in nights / all available nights
  // (num days * num cabins)
  const occupation = confirmedStays.reduce((acc, cur) => acc + cur.numNights, 0) / (numDays * cabinCount);
  return (
    <>
      <Stat title="Bookings" color="blue" icon={<HiOutlineBriefcase />} value={numBookings} />
      <Stat title="Sales" color="green" icon={<HiOutlineBanknotes />} value={formatCurrency(sales)} />
      <Stat title="Check ins" color="indigo" icon={<HiOutlineCalendarDays />} value={checkins} />
      <Stat title="Occupancy Rate" color="yellow" icon={<HiOutlineChartBar />} value={Math.round(occupation * 100) + "%"} />
    </>
  );
}

export default Stats;
