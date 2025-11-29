export default function PRInstructions() {
  return (
    <div className="p-6 dark:border-gray-700 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Manual Webhook Setup</h2>

      <p className="text-gray-700 dark:text-white mb-4">
        You can also manually connect any GitHub repository using a webhook.
      </p>

      <ol className="list-decimal ml-6 text-gray-700 dark:text-white space-y-2">
        <li>Open your GitHub repository settings.</li>
        <li>Go to <strong>Webhooks</strong>.</li>
        <li>Click <strong>Add Webhook</strong>.</li>
        <li>Set Payload URL to:<br />
          <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
            {process.env.NEXT_PUBLIC_BACKEND_URL}/webhooks/github
          </code>
        </li>
        <li>Select <strong>application/json</strong> for content type.</li>
        <li>Enable the event: <strong>Pull Request</strong>.</li>
        <li>Save the webhook.</li>
      </ol>

      <p className="text-sm mt-4 text-gray-500">
       * Manual webhooks allow you to analyze and get comments on PRs from multiple repositories.
            We only display PRs from your primary connected repo here.
      </p>
    </div>
  );
}
