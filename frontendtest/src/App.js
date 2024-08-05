import logo from './logo.svg';
import './App.css';
import FileUpload from './components/fileUpload';
import PaymentForm from './components/PaymentForm';

function App() {
  return (
    <div className="App">
     <PaymentForm/>
     <FileUpload/>
    </div>
  );
}

export default App;
