interface IExpensesLayoutProps {
  children: React.ReactNode;
}

export default function ExpensesLayout({ children }: IExpensesLayoutProps) {
  return (
    <>
      <div className="container relative">
        <section>
          {children}
        </section>
      </div>
    </>
  )
}