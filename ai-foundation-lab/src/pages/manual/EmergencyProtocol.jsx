// src/pages/manual/EmergencyProtocol.jsx
import { LifeBuoy, WifiOff, RefreshCcw, AlertTriangle, Frown } from "lucide-react";

export default function EmergencyProtocol() {
  return (
    <div className="manual-page">
      <header className="manual-page__header">
        <h1 className="manual-page__title">Emergency Protocol</h1>
        <p className="manual-page__subtitle">
          Technology fails. Do not panic. Here is exactly what to do if things go wrong.
        </p>
      </header>

      <div className="manual-prose">
        
        <h3><WifiOff size={24} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> My Internet Disconnected</h3>
        <p>
          If your internet drops, <strong>do not close the browser</strong>. Your code is saved locally in your browser's offline queue. 
          Reconnect your internet, wait a few seconds, and the auto-save will push your code back to the server. A "Saving..." indicator will show when it is back online.
        </p>

        <h3><RefreshCcw size={24} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> My Browser Crashed or Refreshed</h3>
        <p>
          If your computer dies or you accidentally refresh the page:
        </p>
        <ol>
          <li>Open the platform again (<code>app.aifoundationlab.com</code>).</li>
          <li>Log back in.</li>
          <li>Go to your profile and click <strong>Begin Exam</strong>.</li>
          <li>Instead of starting a new exam, the system will detect your active session and show a <strong>Resume Exam</strong> button.</li>
          <li>Click Resume. You will be placed back into the exam with your code intact and the timer still running.</li>
        </ol>

        <h3><Frown size={24} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> I Scored Too Low and Want to Retry</h3>
        <p>
          Every student is given <strong>3 Resets</strong>. If you feel you failed or had a major technical issue, you can go to your profile, click "Begin Exam", and choose <strong>Abandon & Start Fresh</strong>. 
        </p>
        <div className="manual-callout manual-callout--danger">
          <AlertTriangle size={20} />
          <div>
            <strong>Warning:</strong> Abandoning an exam deletes your current progress and consumes one of your 3 resets. Use them wisely.
          </div>
        </div>

        <h3><LifeBuoy size={24} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> I Cannot Load the Python Engine</h3>
        <p>
          The Python runner is a 5MB download that happens when you first open the editor. If it fails to load:
        </p>
        <ul>
          <li>Check your internet connection.</li>
          <li>Wait 10 seconds and click "Run Code" again to force a reload.</li>
          <li>If it still fails, you can still write your code and submit it. The admin will grade it manually.</li>
        </ul>

        <h3><AlertTriangle size={24} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} /> The Exam Terminated Unexpectedly</h3>
        <p>
          If the exam terminated because of a proctoring violation (fullscreen exit or 2 strikes), it cannot be resumed. You must contact the admin team in the Telegram group.
        </p>

      </div>
    </div>
  );
}