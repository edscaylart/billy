
interface IBillsLayoutProps {
  children: React.ReactNode;
}

export default function BillsLayout({ children }: IBillsLayoutProps) {
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