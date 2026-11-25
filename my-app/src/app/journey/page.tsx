import Home from "../page";
import GoToSection from "../components/GoToSection";

export default function Page() {
  return (
    <>
      <Home />
      <GoToSection path="/journey" />
    </>
  );
}
