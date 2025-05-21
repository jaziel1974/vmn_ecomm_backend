import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { format, addDays, subDays, startOfWeek, endOfWeek } from "date-fns";

// Helper to get the start (Wednesday) and end (Tuesday) of the week for a given date
function getCustomWeekRange(date) {
  // 3 = Wednesday, 2 = Tuesday
  const day = date.getDay();
  // If today is Wednesday (3), start is today, end is next Tuesday
  // If today is Tuesday (2), start is last Wednesday, end is today
  // Otherwise, find the previous Wednesday and next Tuesday
  let start, end;
  if (day === 3) {
    start = new Date(date);
    end = addDays(date, 6);
  } else if (day === 2) {
    start = subDays(date, 6);
    end = new Date(date);
  } else if (day < 3) {
    // Sunday (0), Monday (1), Tuesday (2)
    start = subDays(date, (day + 4));
    end = addDays(start, 6);
  } else {
    // Thursday (4), Friday (5), Saturday (6)
    start = subDays(date, (day - 3));
    end = addDays(start, 6);
  }
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
  return { start, end };
}

export default function ProductsPerWeek() {
  const [weekStart, setWeekStart] = useState(() => getCustomWeekRange(new Date()).start);
  const [weekEnd, setWeekEnd] = useState(() => getCustomWeekRange(new Date()).end);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/orders?filterHorta=true&filterDateIni=${weekStart.toISOString()}&filterDateEnd=${weekEnd.toISOString()}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      });
  }, [weekStart, weekEnd]);

  function goToPreviousWeek() {
    setWeekStart(subDays(weekStart, 7));
    setWeekEnd(subDays(weekEnd, 7));
  }
  function goToNextWeek() {
    setWeekStart(addDays(weekStart, 7));
    setWeekEnd(addDays(weekEnd, 7));
  }

  return (
    <Layout>
      <h1>Products Sold Per Week</h1>
      <div className="flex items-center gap-4 mb-4">
        <button className="btn-default" onClick={goToPreviousWeek}>Previous Week</button>
        <span className="font-bold">{format(weekStart, 'dd/MM/yyyy')} - {format(weekEnd, 'dd/MM/yyyy')}</span>
        <button className="btn-default" onClick={goToNextWeek}>Next Week</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Product Name</td>
              <td>Quantity Sold</td>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, idx) => (
              <tr key={idx}>
                <td>{prod._id}</td>
                <td>{prod.qtde}</td>
              </tr>
            ))}
            <tr className="font-bold border-t">
              <td>Total</td>
              <td>{products.reduce((sum, prod) => sum + prod.qtde, 0)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </Layout>
  );
}
