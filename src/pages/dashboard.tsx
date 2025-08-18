import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Layout from "@/components/Layout";
import styles from "../styles/Dashboard.module.css";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Brak ustawionych zmiennych środowiskowych Supabase!');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);


type Budget = {
  id: number;
  category_id: number;
  limit_amount: number;
  period: string;
};

type Category = {
  id: number;
  name: string;
};

type Transaction = {
  id: number;
  category_id: number;
  amount: number;
  transaction_type: string;
};

export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: budgetsData } = await supabase.from("budget_limits").select("*");
      const { data: categoriesData } = await supabase.from("categories").select("*");
      const { data: transactionsData } = await supabase.from("transactions").select("*");

      setBudgets(budgetsData || []);
      setCategories(categoriesData || []);
      setTransactions(transactionsData || []);
    };

    fetchData();
  }, []);

  const getSpentForCategory = (categoryId: number) => {
    return transactions
      .filter((t) => t.category_id === categoryId && t.transaction_type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  return (
    <Layout>
      <h1 className={styles.title}>Witaj!</h1>

      {/* Podsumowanie */}
      <section className={styles.summary}>
        <div className={styles.card}>
          <h2>Saldo</h2>
          <p className={styles.balance}>
            {(
              transactions.reduce(
                (sum, t) =>
                  t.transaction_type === "income"
                    ? sum + Number(t.amount)
                    : sum - Number(t.amount),
                0
              ) || 0
            ).toFixed(2)} zł
          </p>
        </div>
        <div className={styles.card}>
          <h2>Przychody</h2>
          <p className={styles.income}>
            {transactions
              .filter((t) => t.transaction_type === "income")
              .reduce((sum, t) => sum + Number(t.amount), 0)
              .toFixed(2)} zł
          </p>
        </div>
        <div className={styles.card}>
          <h2>Wydatki</h2>
          <p className={styles.expense}>
            {transactions
              .filter((t) => t.transaction_type === "expense")
              .reduce((sum, t) => sum + Number(t.amount), 0)
              .toFixed(2)} zł
          </p>
        </div>
      </section>

      {/* Budżety */}
      <section className={styles.budgets}>
        <h2 className={styles.subtitle}>Budżety</h2>
        <div className={styles.budgetGrid}>
          {budgets.length === 0 ? (
            <p>Brak budżetów</p>
          ) : (
            budgets.map((b) => {
              const spent = getSpentForCategory(b.category_id);
              const remaining = Math.max(0, Number(b.limit_amount) - spent);
              const categoryName =
                categories.find((c) => c.id === b.category_id)?.name || "Nieznana";

              const data = {
                labels: ["Wydane", "Pozostało"],
                datasets: [
                  {
                    data: [spent, remaining],
                    backgroundColor: ["#dc2626", "#16a34a"],
                    hoverBackgroundColor: ["#b91c1c", "#15803d"],
                  },
                ],
              };

              return (
                <div key={b.id} className={styles.budgetCard}>
                  <h3>{categoryName} ({b.period})</h3>
                  <div className={styles.chartWrapper}>
                    <Doughnut
                      data={data}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const value = Number(context.raw);
                                const total = spent + remaining;
                                const percent = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value} zł (${percent}%)`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <p>{spent.toFixed(2)} / {b.limit_amount} zł</p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </Layout>
  );
}
