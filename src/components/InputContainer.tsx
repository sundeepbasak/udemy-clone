export default function InputContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-0.5 bg-gray-800 text-white w-72 md:w-96">{children}</div>
  );
}
