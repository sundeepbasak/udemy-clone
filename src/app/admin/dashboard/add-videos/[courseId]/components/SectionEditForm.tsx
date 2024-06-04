export default function SectionEditForm({ onEdit }: { onEdit: any }) {
  return (
    <form className="border border-black min-h-[100px] p-3">
      <div>
        <label>
          Section:
          <input type="text" />
        </label>
      </div>
      <div>
        <label>
          <h3>Description:</h3>
          <input type="text" />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="border border-black px-2 py-3"
        >
          Cancel
        </button>
        <button type="submit" className="border border-black px-2 py-3">
          Submit
        </button>
      </div>
    </form>
  );
}
