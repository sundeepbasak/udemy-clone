import { Button } from "@/components/ui/button";

export default function Notifications() {
  return (
    <div className="bg-white p-6">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">General Settings</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Language:</p>
            <select className="border rounded-md p-2">
              <option>English</option>
              <option>Français</option>
              <option>Español</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Notification Preferences:</p>
            <div className="space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                  checked
                />
                <span className="ml-2">Email</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-blue-500"
                />
                <span className="ml-2">SMS</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Appearance</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Theme:</p>
            <select className="border rounded-md p-2">
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-700">Font Size:</p>
            <select className="border rounded-md p-2">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </div>
      <Button>Save Changes</Button>
    </div>
  );
}
