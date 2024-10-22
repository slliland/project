import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/Home';
import Create from './containers/Create';
import ScrollToTop from './components/ScrollToTop';
import { testCategories, testItems } from './testData'; // Import your test data

export const AppContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: testItems,  // Use testItems directly
      categories: testCategories,  // Use testCategories directly
    };
    this.actions = {
      deleteItem: (item) => {
        const filteredItems = this.state.items.filter(i => i.id !== item.id);
        this.setState({ items: filteredItems });
      }
    };
  }

  render() {
    return (
      <AppContext.Provider value={{
        state: this.state,
        actions: this.actions,
      }}>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/edit/:id" element={<Create />} />
            </Routes>
          </div>
        </Router>
      </AppContext.Provider>
    );
  }
}

export default App;
