import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import InvoiceForm from "../InvoiceForm";
import "./QuickBilling.css"
const Quickbilling= () => {
  return (
    <div className="quickbilling">
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container>
        <InvoiceForm />
      </Container>
    </div>
    </div>
  );
};
export default Quickbilling;