export function FormMessage({
  type,
  children,
}: {
  type: "error" | "success";
  children: React.ReactNode;
}) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-sage/30 bg-sage/10 text-forest";

  return (
    <div
      className={`rounded-sm border px-4 py-3 text-sm leading-relaxed ${styles}`}
      role={type === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
