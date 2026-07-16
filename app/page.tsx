import EmailComposer from "./components/email/EmailComposer";
import EmailForm from "./components/email/EmailForm";
import Navbar from "./components/layout/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <EmailComposer />
    </div>
  );
}
