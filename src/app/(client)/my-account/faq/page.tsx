"use client";

export default function AccountSecurity() {
  return (
    <div className="bg-white p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="text-lg font-semibold">
            How do I enroll in a course?
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor
            justo sed quam faucibus, eget vehicula odio tincidunt.
          </p>
        </div>
        <div className="border-b pb-2">
          <h2 className="text-lg font-semibold">Can I change my username?</h2>
          <p>
            Yes, you can change your username by going to the settings page and
            updating your profile information.
          </p>
        </div>
        <div className="border-b pb-2">
          <h2 className="text-lg font-semibold">How do I reset my password?</h2>
          <p>{`If you forget your password, you can use the "Forgot Password" link on the login page to reset your password.`}</p>
        </div>
      </div>
    </div>
  );
}
