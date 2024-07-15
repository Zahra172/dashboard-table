import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

export default function Home() {
  const [nameSearch, setNameSearch] = useState("");
  const [amountSearch, setAmountSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await axios.get("https://zahra172.github.io/host-api/data.json");
        setCustomers(data.customers);
        setTransactions(data.transaction);
        setFilteredTransactions(data.transaction); // Initialize filteredTransactions with all transactions
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData();
  }, []);

  const handleNameSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setNameSearch(searchTerm);
    filterTransactions(searchTerm, amountSearch);
  };

  const handleAmountSearchChange = (e) => {
    const searchTerm = e.target.value;
    setAmountSearch(searchTerm);
    filterTransactions(nameSearch, searchTerm);
  };

  const filterTransactions = (nameSearchTerm, amountSearchTerm) => {
    const filtered = transactions.filter((transaction) => {
      const customer = customers.find((c) => c.id === transaction.customer_id);
      const customerName = customer ? customer.name.toLowerCase() : "";
      const amountMatch = transaction.amount.toString().includes(amountSearchTerm);
      return customerName.includes(nameSearchTerm) && amountMatch;
    });
    setFilteredTransactions(filtered);
  };

  // Function to calculate data for PieChart based on filteredTransactions
  const getPieChartData = () => {
    const groupedData = {};

    // Group transactions by customer name
    filteredTransactions.forEach((transaction) => {
      const customer = customers.find((c) => c.id === transaction.customer_id);
      const customerName = customer ? customer.name : "Unknown";

      if (groupedData[customerName]) {
        groupedData[customerName] += transaction.amount;
      } else {
        groupedData[customerName] = transaction.amount;
      }
    });

    const pieData = Object.keys(groupedData).map((name) => ({
      name,
      value: groupedData[name],
    }));

    return pieData;
  };

  return (
    <div className="w-10/12 m-auto">
      <h1>Customers and Transactions</h1>

      <form className="mx-auto w-full flex justify-between gap-2 mt-6">
        <div className="relative w-full mb-4">
          <label
            htmlFor="name-search"
            className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search by Name
          </label>
          <input
            onChange={handleNameSearchChange}
            type="search"
            id="name-search"
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by name..."
          />
        </div>
        <div className="relative w-full">
          <label
            htmlFor="amount-search"
            className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search by Amount
          </label>
          <input
            onChange={handleAmountSearchChange}
            type="search"
            id="amount-search"
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by amount..."
          />
        </div>
      </form>
      <div className="text-center my-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={getPieChartData()}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            />
          </PieChart>
        </ResponsiveContainer>
        <p className="mb-10  text-[#8884d8] dark:text-white">total amount </p>
      </div>

      <div className="relative overflow-x-auto w-full mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#8884d8] dark:bg-gray-700 ">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 dark:text-gray-400 uppercase tracking-wider"
              >
                Customer Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 dark:text-gray-400 uppercase tracking-wider"
              >
                Transaction ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 dark:text-gray-400 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-100 dark:text-gray-400 uppercase tracking-wider"
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredTransactions.map((transaction) => {
              const customer = customers.find(
                (c) => c.id === transaction.customer_id
              );
              return (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer ? customer.name : "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transaction.amount}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
