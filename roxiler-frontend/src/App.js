import React, { Component } from 'react';
import { Circles } from "react-loader-spinner";
import './App.css';
import GetBarChart from './components/GetBarChart';

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

class App extends Component {
  state = {
    searchInput: '',
    transactions: [],
    selectedMonth: '2',
    apiStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getTransactions();
    
  }

  getTransactions = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const { searchInput } = this.state;
    const url = `https://transaction-dashboard-server-two.vercel.app/alltransactions/?search=${searchInput}`;

    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      this.setState({ transactions: data, apiStatus: apiStatusConstants.success });
    }
    else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
    
  };

  onChangeSearchInput = (event) => {
    this.setState({ searchInput: event.target.value }, this.getTransactions);
  };

  onChangeSelectedMonth = (event) => {
    this.setState({ selectedMonth: event.target.value }, this.getTransactions);
  };

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Circles type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  );

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  renderSuccessView = () => {
    const { searchInput, transactions, selectedMonth} = this.state;

    console.log(transactions)

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthInWords = selectedMonth === "All" ? "All Months" : months[parseInt(selectedMonth)]
    const filterTransaction = transactions.filter(each => {
      const month = new Date(each.dateOfSale).getMonth();
      if (parseInt(selectedMonth) === month || selectedMonth === "All") {
        return each
      }
  
      return null
    })

    const soldCount = filterTransaction.reduce((acc, item) => (item.sold ? acc + 1 : acc), 0);
    const notSoldCount = filterTransaction.reduce((acc, item) => (item.sold === false ? acc + 1 : acc), 0);
    const totalSale = filterTransaction.reduce((acc, item) => (item.sold ? acc + item.price : acc), 0);
    return (
      <div className="bg-container">
      <div className="card-container">
        <h1 className="heading">Transaction Dashboard</h1>
        <div className="search-filter-container">
          <input className='search-input'
            onChange={this.onChangeSearchInput}
            value={searchInput}
            type="search"
            placeholder="Search transaction"
          />
          <select className='month-fliter' value={selectedMonth} onChange={this.onChangeSelectedMonth}>
          <option value="All">All Months</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {filterTransaction.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold}</td>
                  <td>
                    <img className="image" src={transaction.image} alt={transaction.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h1 className="heading">Statistics - {monthInWords}</h1>
          <div className='statics-container'>
          <p>Total Sale: Rs. {totalSale}</p>
          <p>Total Sold Item:{soldCount}</p>
          <p>Total Not Sold Item: {notSoldCount}</p>
          </div>
          
        </div>
        <GetBarChart data={filterTransaction} month={monthInWords}/>
      </div>
    </div>
    )

  }

  renderConditionalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      case apiStatusConstants.success:
        return this.renderSuccessView();
      case apiStatusConstants.failure:
        return this.renderFailureView();

      default:
        return null;
    }
  };

  render() {
    return (
      <div>
        {this.renderConditionalView()}
      </div>
    );
  }
}

export default App;
