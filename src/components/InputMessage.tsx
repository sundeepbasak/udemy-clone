export default function InputMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-right text-sm p-2">{children}</div>;
}
